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
              stock: item.quantity,
            },
          ],
        },
        user,
      );
      // const productDoc = await this.inventoryModel.findOne({
      //   product: item.product,
      //   branch: branch,
      // });
      // if (!productDoc) {
      //   throw new HttpException(
      //     {
      //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //       message: `Không tìm thấy sản phẩm`,
      //     },
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }
      // const variant = productDoc.variants.find(
      //   (v) => v.variantId.toString() === item.variant,
      // );
      // if (variant.stock < item.quantity) {
      //   throw new HttpException(
      //     {
      //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //       message: `Không đủ hàng cho sản phẩm `,
      //     },
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }
      // if (!variant) {
      //   throw new HttpException(
      //     {
      //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //       message: `Không tìm thấy biến thể cho sản phẩm }`,
      //     },
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }
      // if (variant.stock < item.quantity) {
      //   throw new HttpException(
      //     {
      //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //       message: `Không đủ hàng cho biến thể ${variant.variantId}`,
      //     },
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }

      totalPrice += item.price * item.quantity;
      // const updatedStockVariants = productDoc.variants.map((v) => {
      //   if (v.variantId.toString() === item.variant.toString()) {
      //     v.stock = Math.max(v.stock - item.quantity, 0);
      //   }
      //   return v;
      // });

      // await this.inventoryModel.findOneAndUpdate(
      //   { _id: productDoc._id },
      //   { variants: updatedStockVariants },
      //   { new: true },
      // );
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
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
