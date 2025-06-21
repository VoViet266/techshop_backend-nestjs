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
import { PaymentMethod, PaymentStatus } from 'src/constant/payment.enum';
import { Payment, PaymentDocument } from 'src/payment/schemas/payment.schema';
import mongoose, { Types } from 'mongoose';

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
      await this.inventoryService.exportStock(
        {
          branchId: createOrderDto.branch,
          productId: item.product,
          variants: [
            {
              variantId: item.variant,
              quantity: item.quantity,
            },
          ],
        },
        user,
      );

      totalPrice += item.price * item.quantity;
    }
    const newOrder = await this.orderModel.create({
      branch: createOrderDto.branch,
      phone: createOrderDto.phone,
      items: itemsToOrder,
      totalPrice: totalPrice,
      user: user._id,
      paymentMethod: createOrderDto.paymentMethod,
      status: OrderStatus.PENDING,
      paymentStatus:
        createOrderDto.paymentStatus === PaymentMethod.CASH
          ? PaymentStatus.COMPLETED
          : PaymentStatus.PENDING,
      createdBy: {
        name: user.name,
        email: user.email,
      },
      source: createOrderDto.items ? 'pos' : 'online',
    });
    const newPayment = await this.paymentModel.create({
      order: newOrder._id,
      user: user._id,
      amount: totalPrice,
      payType: createOrderDto.paymentMethod,
      status:
        createOrderDto.paymentMethod === 'cash'
          ? PaymentStatus.COMPLETED
          : PaymentStatus.PENDING,
      paymentTime:
        createOrderDto.paymentMethod === 'cash' ? new Date() : undefined,
    });

    newOrder.payment = newPayment._id 
    await newOrder.save();

    // Nếu là online thì xóa giỏ hàng
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      await this.cartModel.findOneAndDelete({ user: user._id });
    }

    return newOrder;
  }

  findAll(user: IUser) {
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
      });
  }

  findOne(id: number) {
    return this.orderModel
      .findById(id)
      .populate('items.product')
      .populate('items.variant');
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    const orderExist = this.orderModel.findById(id);
    if (!orderExist) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Đơn hàng không tồn tại',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.orderModel.findByIdAndUpdate(
      id,
      { $set: updateOrderDto },
      { new: true },
    );
  }

  async remove(id: number) {
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
  // async cancelOrder(id: number, user: IUser) {
  //   const order = await this.orderModel.findById(id);
  //   if (!order) {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.NOT_FOUND,
  //         message: 'Đơn hàng không tồn tại',
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   if (order.user.toString() !== user._id.toString()) {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.FORBIDDEN,
  //         message: 'Bạn không có quyền hủy đơn hàng này',
  //       },
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }

  //   if (order.status === 'Cancelled') {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         message: 'Đơn hàng đã được hủy trước đó',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   // Update order status to 'Cancelled'
  //   order.status = 'Cancelled';
  //   await order.save();

  //   // Restore stock for each item in the order
  //   for (const item of order.items) {
  //     await this.inventoryService.importStock(
  //       {
  //         branchId: order.branch,
  //         productId: item.product,
  //         variants: [
  //           {
  //             variantId: item.variant,
  //             stock: item.quantity,
  //           },
  //         ],
  //       },
  //       user,
  //     );
  //   }

  //   return { message: 'Đơn hàng đã được hủy thành công' };
  // }
}
