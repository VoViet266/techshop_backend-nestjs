import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { ProductDocument, Products } from 'src/product/schemas/product.schema';
import { Cart, CartDocument } from 'src/cart/schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import {
  Inventory,
  InventoryDocument,
} from 'src/inventory/schemas/inventory.schema';
import { InventoryService } from 'src/inventory/inventory.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: SoftDeleteModel<CartDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<InventoryDocument>,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    //Tìm sản phẩm trong giỏ hàng của user
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

    createOrderDto.items = userCart.items.map((item) => {
      return {
        product: item.product.toString(),
        quantity: item.quantity,
        variant: item.variant.toString(),
        price: item.price,
      };
    });

    let totalPrice = 0;
    for (const item of createOrderDto.items) {
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

    createOrderDto.totalPrice = totalPrice;
    const newOrder = await this.orderModel.create({
      ...createOrderDto,
      user: user._id,
      createdBy: {
        id: user._id,
        email: user.email,
      },
    });
    //Xóa giỏ hàng sau khi tạo đơn hàng
    await this.cartModel.findOneAndDelete({ user: user._id });
    return newOrder;
  }

  findAll(user: IUser) {
    return this.orderModel.find({ user: user._id });
  }

  findOne(id: number) {
    return this.orderModel
      .findById(id)
      .populate('items.product')
      .populate('items.variant');
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
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
