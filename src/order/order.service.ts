import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { ProductDocument, Products } from 'src/product/schemas/product.schema';
import { Cart, CartDocument } from 'src/cart/schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';

import { InventoryService } from 'src/inventory/inventory.service';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { RolesUser } from 'src/constant/roles.enum';
import { OrderStatus } from 'src/constant/orderStatus.enum';
import {
  OrderSource,
  PaymentMethod,
  PaymentStatus,
} from 'src/constant/payment.enum';
import { Payment, PaymentDocument } from 'src/payment/schemas/payment.schema';
import mongoose, { Types } from 'mongoose';
import { TransactionSource } from 'src/constant/transaction.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: SoftDeleteModel<CartDocument>,
    // @InjectModel(Inventory.name)
    // private readonly inventoryModel: SoftDeleteModel<InventoryDocument>,

    @InjectModel(Payment.name)
    private readonly paymentModel: SoftDeleteModel<PaymentDocument>,

    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,

    private readonly inventoryService: InventoryService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    if (user.role === RolesUser.Staff) {
      // Nếu là nhân viên, kiểm tra branch
      if (!user.branch) {
        throw new ForbiddenException('Bạn chưa được gán chi nhánh!');
      }

      if (createOrderDto.branch.toString() !== user.branch.toString()) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền tạo đơn tại chi nhánh của mình!',
        );
      }
    }
    let itemsToOrder = [];
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      const userCart = await this.cartModel.findOne({ user: user._id });
      if (!userCart || userCart.items.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Giỏ hàng của bạn đang trống!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      itemsToOrder = userCart.items.map((item) => ({
        product: item.product.toString(),
        quantity: item.quantity,
        variant: item.variant.toString(),
        price: item.price,
        branch: item.branch.toString(),
      }));
    } else {
      // Nếu là nhân viên tạo tại quầy
      itemsToOrder = createOrderDto.items;
    }

    // Get user phone
    const findUser = await this.userModel.findById(user._id);
    let phone = findUser?.phone || '';
    createOrderDto.phone = createOrderDto.phone || phone;

    // Xuất kho + tính tổng
    let totalPrice = 0;
    for (const item of itemsToOrder) {
      totalPrice += item.price * item.quantity;
    }
    const newOrder = await this.orderModel.create({
      phone: createOrderDto.phone,
      items: itemsToOrder,
      totalPrice: totalPrice,
      user: user._id,
      paymentMethod: createOrderDto.paymentMethod,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdBy: {
        name: user.name,
        email: user.email,
      },
      source: createOrderDto.items ? OrderSource.POS : OrderSource.ONLINE,
      shippingAddress: createOrderDto.shippingAddress || '',
    });
    const newPayment = await this.paymentModel.create({
      order: newOrder._id,
      user: user._id,
      amount: totalPrice,
      payType: createOrderDto.paymentMethod,
      status: PaymentStatus.PENDING,
      paymentTime:
        createOrderDto.paymentMethod === OrderSource.POS
          ? new Date()
          : undefined,
    });

    newOrder.payment = newPayment._id;
    await newOrder.save();

    // Nếu là online thì xóa giỏ hàng
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      await this.cartModel.findOneAndDelete({ user: user._id });
    }

    return newOrder;
  }

  findAllByCustomer(user: IUser) {
    return this.orderModel
      .find({ user: user._id })
      .populate({
        path: 'items.product',
        select: 'name ',
      })
      .populate({
        path: 'items.variant',
        select: 'name ',
      })
      .populate({
        path: 'branch',
        select: 'name phone address email',
      })
      .sort({ createdAt: -1 });
  }

  findAllByStaff(user: IUser) {
    switch (user.role) {
      case RolesUser.Admin:
        return this.orderModel
          .find()
          .populate({ path: 'items.branch', select: 'name ' })
          .populate({ path: 'items.product', select: 'name ' })
          .populate({ path: 'items.variant', select: 'name ' })
          .sort({ createdAt: -1 });

      case RolesUser.Staff:
        return this.orderModel
          .find({ branch: user.branch })
          .populate({ path: 'items.branch', select: 'name ' })
          .populate({ path: 'items.product', select: 'name ' })
          .populate({ path: 'items.variant', select: 'name ' })
          .sort({ createdAt: -1 });

      default:
        throw new ForbiddenException('Bạn không có quyền truy cập!');
    }
  }

  findOne(id: number) {
    return this.orderModel
      .findById(id)
      .populate('items.product')
      .populate('items.variant');
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: IUser) {
    const orderExist = await this.orderModel.findById(id);
    if (!orderExist) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Đơn hàng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    orderExist.status = updateOrderDto.status;
    orderExist.paymentStatus = updateOrderDto.paymentStatus;
    orderExist.save();

    if (
      (updateOrderDto.status = OrderStatus.DELIVERED) &&
      updateOrderDto.paymentStatus === PaymentStatus.COMPLETED
    ) {
      for (const item of orderExist.items) {
        await this.productModel.updateOne(
          { _id: item.product },
          { $inc: { sold: item.quantity } },
        );

        await this.inventoryService.exportStock(
          {
            branchId: item.branch.toString(),
            productId: item.product.toString(),
            variants: [
              {
                variantId: item.variant.toString(),
                quantity: item.quantity,
              },
            ],
          },
          user,
        );
      }
    }

    return 'Update order successfully';
  }

  async remove(id: string) {
    return this.orderModel.findByIdAndDelete(id).then((result) => {
      if (!result) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Đơn hàng không tồn tại',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Đơn hàng đã được xóa thành công' };
    });
  }
  async cancelOrder(id: string, user: IUser) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Đơn hàng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (order.user.toString() !== user._id.toString()) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Bạn không có quyền hủy đơn hàng này',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      order.paymentStatus === PaymentStatus.COMPLETED ||
      order.paymentStatus === PaymentStatus.CANCELLED ||
      order.paymentStatus === PaymentStatus.REFUNDED
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Không thể hủy đơn hàng!!!!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    order.paymentStatus = PaymentStatus.CANCELLED;
    await order.save();
    const payment = await this.paymentModel.findById(order.payment);
    payment.status = PaymentStatus.CANCELLED;
    await payment.save();

    return { message: 'Đơn hàng đã được hủy thành công' };
  }

  async refundOrder(id: string, user: IUser) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Đơn hàng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (order.user.toString() !== user._id.toString()) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Không có quyện hủy đơn hàng nây',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      order.paymentStatus === PaymentStatus.CANCELLED ||
      order.paymentStatus === PaymentStatus.REFUNDED
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Không thể hủy đơn hàng!!!!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    order.paymentStatus = PaymentStatus.REFUNDED;
    await order.save();
    const payment = await this.paymentModel.findById(order.payment);
    payment.status = PaymentStatus.REFUNDED;
    await payment.save();
    for (const item of order.items) {
      await this.inventoryService.importStock(
        {
          branchId: item.branch.toString(),
          productId: item.product?.toString(),
          variants: [
            {
              variantId: item.variant?.toString(),
              quantity: item.quantity,
            },
          ],
          source: TransactionSource.RETURN,
        },
        user,
      );
    }
    return { message: 'Đơn hàng đã được hủy thanh toán' };
  }
}
