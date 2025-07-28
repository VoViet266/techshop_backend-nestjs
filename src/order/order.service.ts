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
import { CartService } from 'src/cart/cart.service';
import {
  Promotion,
  PromotionDocument,
} from 'src/benefit/schemas/promotion.schema';
import {
  WarrantyPolicy,
  WarrantyPolicyDocument,
} from 'src/benefit/schemas/warrantypolicy.schema';
import { an } from '@faker-js/faker/dist/airline-CLphikKp';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: SoftDeleteModel<CartDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: SoftDeleteModel<PaymentDocument>,
    @InjectModel(Promotion.name)
    private readonly promotionModel: SoftDeleteModel<PromotionDocument>,
    @InjectModel(WarrantyPolicy.name)
    private readonly warrantyModel: SoftDeleteModel<WarrantyPolicyDocument>,
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly inventoryService: InventoryService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    // 1. Kiểm tra quyền chi nhánh nếu là nhân viên
    if (user.role === RolesUser.Staff) {
      if (!user.branch) {
        throw new ForbiddenException('Bạn chưa được gán chi nhánh!');
      }
      const hasBranch = createOrderDto.items.some(
        (item) => item.branch !== user.branch,
      );
      if (hasBranch) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền tạo đơn tại chi nhánh của mình!',
        );
      }
    }

    // 2. Lấy items từ giỏ hàng hoặc từ POS (tạo tại quầy)
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
      itemsToOrder = createOrderDto.items;
    }

    // 3. Lấy số điện thoại người đặt
    const findUser = await this.userModel.findById(user._id);
    let phone = findUser?.phone || '';
    createOrderDto.phone = createOrderDto.phone || phone;

    // 4. Tính tổng tiền và áp dụng promotion
    let totalPrice = 0;
    let totalPriceWithPromotion = 0;
    const appliedPromotions = [];

    // Tính tổng tiền gốc
    for (const item of itemsToOrder) {
      totalPrice += item.price * item.quantity;
    }

    // Lấy tất cả promotion đang hoạt động
    const currentDate = new Date();
    const activePromotions = await this.promotionModel
      .find({
        isActive: true,
        $or: [
          { startDate: { $lte: currentDate }, endDate: { $gte: currentDate } },
          { startDate: { $exists: false }, endDate: { $exists: false } },
        ],
      })
      .sort({ value: -1 }); // Sắp xếp theo giá trị giảm giá từ cao xuống thấp

    // Kiểm tra và áp dụng promotion phù hợp
    let finalDiscount = 0;
    for (const promotion of activePromotions) {
      // Kiểm tra điều kiện của promotion
      let isEligible = true;

      if (promotion.conditions) {
        // Kiểm tra điều kiện đơn hàng tối thiểu
        if (
          promotion.conditions.minOrder &&
          totalPrice < promotion.conditions.minOrder
        ) {
          isEligible = false;
        }

        // Kiểm tra phương thức thanh toán

        if (
          promotion.conditions.payment &&
          createOrderDto.paymentMethod.toLocaleLowerCase() !==
            promotion.conditions.payment.toLocaleLowerCase()
        ) {
          isEligible = false;
        }
      }

      if (isEligible) {
        let discountAmount = 0;

        if (promotion.valueType === 'fixed') {
          discountAmount = promotion.value;
        } else if (promotion.valueType === 'percent') {
          discountAmount = (totalPrice * promotion.value) / 100;
        }

        // Chọn promotion có giá trị giảm giá cao nhất (chỉ áp dụng 1 promotion)
        if (discountAmount > finalDiscount) {
          finalDiscount = discountAmount;
          appliedPromotions.length = 0; // Xóa promotion cũ
          appliedPromotions.push({
            promotionId: promotion._id,
            title: promotion.title,
            valueType: promotion.valueType,
            value: promotion.value,
            discountAmount: discountAmount,
          });
        }

        break; // Chỉ áp dụng promotion đầu tiên phù hợp
      }
    }

    // Tính tổng tiền sau khi áp dụng promotion
    totalPriceWithPromotion = Math.max(0, totalPrice - finalDiscount);
    if (!createOrderDto.recipient) {
      throw new HttpException(
        'Thông tin người nhận không được để trống',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 5. Tạo đơn hàng
    const newOrder = await this.orderModel.create({
      phone: createOrderDto.phone,
      items: itemsToOrder,
      recipient: createOrderDto.recipient,
      totalPrice: totalPriceWithPromotion,
      discountAmount: finalDiscount,
      appliedPromotions: appliedPromotions,
      user: user._id,
      paymentMethod: createOrderDto.paymentMethod,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdBy: {
        name: user.name,
        email: user.email,
      },
      source:
        createOrderDto.items && createOrderDto.items.length > 0
          ? OrderSource.POS
          : OrderSource.ONLINE,
    });

    const newPayment = await this.paymentModel.create({
      order: newOrder._id,
      user: user._id,
      amount: totalPriceWithPromotion, // Sử dụng số tiền sau khi giảm giá
      payType: createOrderDto.paymentMethod,
      status: PaymentStatus.PENDING,
      paymentTime:
        createOrderDto.paymentStatus === PaymentStatus.COMPLETED
          ? new Date()
          : undefined,
    });

    // 7. Gán payment và lưu order
    newOrder.payment = newPayment._id;
    await newOrder.save();

    // 8. Nếu là đặt hàng online thì xoá giỏ hàng
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      await this.cartService.remove(user);
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
        path: 'items.branch',
        select: 'name',
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

  async update(id: string, updateOrderDto: UpdateOrderDto, user: any) {
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
    const userInfor = await this.userService.findOne(user._id.toString());

    const userEmail = userInfor.email;
    const userName = userInfor.name;
    if ((updateOrderDto.status = OrderStatus.DELIVERED)) {
      for (const item of orderExist.items) {
        await this.productModel.updateOne(
          { _id: item.product },
          { $inc: { sold: item.quantity } },
        );

        await this.inventoryService.exportStock(
          {
            branchId: item.branch.toString(),
            productId: item.product.toString(),
            source: TransactionSource.ORDER,
            variants: [
              {
                variantId: item.variant.toString(),
                quantity: item.quantity,
              },
            ],
          },
          {
            email: userEmail,
            name: userName,
          },
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
    await this.orderModel.findByIdAndUpdate(id, {
      status: OrderStatus.CANCELLED,
      paymentStatus: PaymentStatus.CANCELLED,
    });

    const payment = await this.paymentModel.findById(order.payment);

    await this.paymentModel.findByIdAndUpdate(payment._id, {
      status: PaymentStatus.CANCELLED,
    });

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
    order.status = OrderStatus.RETURNED;
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
    return { message: 'Đơn hàng đã được hoàn' };
  }
}
