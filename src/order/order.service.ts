import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
import { UserService } from 'src/user/user.service';
import { Branch, BranchDocument } from 'src/branch/schemas/branch.schema';
import { HttpService } from '@nestjs/axios'; 
import { firstValueFrom } from 'rxjs'; 
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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
    @InjectModel(Branch.name)
    private readonly branchModel: SoftDeleteModel<BranchDocument>,
    private readonly inventoryService: InventoryService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}
  private async geocodeAddress(address: string): Promise<number[] | null> {
    const API_KEY = this.configService.get<string>('GEOAPIFY_SECRET_KEY');

    if (!API_KEY) {
      console.error('GEOAPIFY_SECRET_KEY chưa được cài đặt.');
      return null;
    }
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      address,
    )}&apiKey=${API_KEY}&limit=1&lang=vi`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const features = response.data.features;

    
      if (features && features.length > 0) {
        return features[0].geometry.coordinates;
      }
      return null;
    } catch (error) {
      console.error('Lỗi Geocoding (Geoapify):', error.message);
      return null;
    }
  }
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
    const orderSource =
      createOrderDto.items && createOrderDto.items.length > 0
        ? OrderSource.POS
        : OrderSource.ONLINE;
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
        color: item.color,
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

    const firstBranchId = itemsToOrder[0].branch;
    const orderBranch = await this.branchModel
      .findById(firstBranchId)
      .select('name address location');
    if (!orderBranch) {
      throw new NotFoundException(
        `Không tìm thấy chi nhánh với ID ${firstBranchId}`,
      );
    }
    if (
      !orderBranch.location ||
      !orderBranch.location.coordinates ||
      orderBranch.location.coordinates.length !== 2
    ) {
      throw new BadRequestException(
        `Chi nhánh ${orderBranch.name} chưa được thiết lập vị trí (location). Không thể tạo tracking.`,
      );
    }

    // Chuẩn bị dữ liệu tracking ban đầu
    const initialLocation = orderBranch.location;
    const initialAddress = orderBranch.address || orderBranch.name; 
    const initialTrackingEntry = {
      location: initialLocation,
      address: initialAddress,
      status: OrderStatus.PENDING, 
      timestamp: new Date(),
    };
    let recipientLocationData = null;
    const recipientAddress = createOrderDto.recipient?.address;
    if (recipientAddress) {
      const coordinates = await this.geocodeAddress(recipientAddress);
      
      if (coordinates) {
        recipientLocationData = {
          type: 'Point',
          coordinates: coordinates,
        };
      } else {
        console.warn(`Không thể geocode địa chỉ: ${recipientAddress}`);
      }
    }
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

        break;
      }
    }

    // Tính tổng tiền sau khi áp dụng promotion
    totalPriceWithPromotion = Math.max(0, totalPrice - finalDiscount);

    // 5. Tạo đơn hàng
    const newOrder = await this.orderModel.create({
      phone: createOrderDto.phone,
      items: itemsToOrder,
      recipient: createOrderDto?.recipient || {
        name: findUser?.name,
        phone: createOrderDto.phone || findUser?.phone || '',
      },
      buyer: createOrderDto.buyer || {
        name: findUser?.name,
        phone: findUser?.phone || '',
      },

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
     
      source: orderSource,
      currentLocation: initialLocation,
      trackingHistory: [initialTrackingEntry],
      recipientLocation: recipientLocationData,
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

    if (orderSource === OrderSource.ONLINE) {
      await this.cartService.remove(user);
    }

    return newOrder;
  }
  async findTrackingDetails(orderId: string) {
    // Chỉ chọn (select) những trường cần thiết cho bản đồ
    const order = await this.orderModel
      .findById(orderId)
      .select('trackingHistory recipientLocation recipient.address status');

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Trả về dữ liệu đúng định dạng mà component React mong đợi
    return {
      trackingHistory: order.trackingHistory,
      recipientLocation: order.recipientLocation,
      recipientAddress: order.recipient?.address,
      status: order.status,
    };
  }
  async findLatestTrackingForUser(userId: string) {
    const order = await this.orderModel
      .findOne({
        user: userId,
        status: OrderStatus.SHIPPING, // Chỉ tìm đơn đang giao
      })
      .sort({ createdAt: -1 }); // Lấy đơn mới nhất

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng nào đang giao.');
    }

    if (!order.currentLocation || !order.currentLocation.coordinates) {
      throw new NotFoundException('Đơn hàng chưa có thông tin vị trí.');
    }

    // Chỉ trả về đúng object location
    return order.currentLocation;
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
    if (user.role === RolesUser.Admin) {
      return this.orderModel
        .find()
        .populate({ path: 'items.branch', select: 'name ' })
        .populate({ path: 'items.product', select: 'name ' })
        .populate({ path: 'items.variant', select: 'name ' })
        .sort({ createdAt: -1 });
    }
    return this.orderModel
      .find({ items: { $elemMatch: { branch: user.branch } } })
      .populate({ path: 'items.branch', select: 'name ' })
      .populate({ path: 'items.product', select: 'name ' })
      .populate({ path: 'items.variant', select: 'name ' })
      .sort({ createdAt: -1 });
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
                variantColor: item.variantColor,
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
  async requestReturn(
    orderId: string,
    dto: {
      returnReason: string;
    },
  ) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    if (order.isReturned) {
      throw new BadRequestException('Đơn hàng đã có yêu cầu trả hàng trước đó');
    }

    order.isReturned = true;
    order.returnReason = dto.returnReason;
    order.returnStatus = 'requested';
    await order.save();

    return { message: 'Yêu cầu trả hàng đã được gửi', order };
  }
  async confirmReturn(
    orderId: string,

    returnStatus: string,

    user: IUser,
  ) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    if (!order.isReturned) {
      throw new BadRequestException('Đơn hàng này chưa có yêu cầu trả hàng');
    }

    order.returnStatus = returnStatus;

    // Nếu duyệt → cập nhật số tiền hoàn
    if (returnStatus === 'approved') {
      order.paymentStatus = PaymentStatus.REFUNDED;
      order.status = OrderStatus.RETURNED;
    }

    // Nếu từ chối → reset trạng thái trả hàng
    if (returnStatus === 'rejected') {
      order.isReturned = false;
    }

    order.returnProcessedBy = {
      name: user.name,
      email: user.email,
    };

    if (returnStatus === 'completed') {
      if (order.payment) {
        const payment = await this.paymentModel.findById(order.payment);
        if (payment) {
          payment.status = PaymentStatus.REFUNDED;
          await payment.save();
        }
      }
      for (const item of order.items) {
        await this.inventoryService.importStock(
          {
            branchId: item.branch.toString(),
            productId: item.product?.toString(),
            variants: [
              {
                variantId: item.variant?.toString(),
                variantColor: item.variantColor,
                quantity: item.quantity,
              },
            ],
            source: TransactionSource.RETURN,
          },
          user,
        );
      }
    }

    await order.save();
    return { message: `Đã ${returnStatus} yêu cầu trả hàng`, order };
  }

  // async refundOrder(
  //   id: string,
  //   user: IUser,
  //   dto: {
  //     returnReason: string;
  //     returnStatus: string;
  //     isReturned: boolean;
  //   },
  // ) {
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
  //         message: 'Không có quyện hủy đơn hàng nây',
  //       },
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }

  //   if (
  //     order.paymentStatus === PaymentStatus.CANCELLED ||
  //     order.paymentStatus === PaymentStatus.REFUNDED
  //   ) {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         message: 'Không thể hủy đơn hàng!!!!',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   order.paymentStatus = PaymentStatus.REFUNDED;
  //   order.status = OrderStatus.RETURNED;
  //   await order.save();
  //   const payment = await this.paymentModel.findById(order.payment);
  //   payment.status = PaymentStatus.REFUNDED;
  //   await payment.save();
  //   for (const item of order.items) {
  //     await this.inventoryService.importStock(
  //       {
  //         branchId: item.branch.toString(),
  //         productId: item.product?.toString(),
  //         variants: [
  //           {
  //             variantId: item.variant?.toString(),
  //             quantity: item.quantity,
  //           },
  //         ],
  //         source: TransactionSource.RETURN,
  //       },
  //       user,
  //     );
  //   }
  //   return { message: 'Đơn hàng đã được hoàn' };
  // }
}
