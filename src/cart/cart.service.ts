import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductDocument, Products } from 'src/product/schemas/product.schema';
import { IUser } from 'src/user/interface/user.interface';
import { Types } from 'mongoose';
import { Variant, VariantDocument } from 'src/product/schemas/variant.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: SoftDeleteModel<CartDocument>,
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(Variant.name)
    private readonly variantModel: SoftDeleteModel<VariantDocument>,
  ) {}
  async create(createCartDto: CreateCartDto, user: IUser) {
    // Tìm giỏ hàng của user
    let cart = await this.cartModel.findOne({ user: user._id });
    if (!cart) {
      // Nếu chưa có giỏ hàng thì tạo mới với user, items rỗng
      cart = await this.cartModel.create({
        user: user._id,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      });
    }

    for (const newItem of createCartDto.items) {
      // Lấy sản phẩm theo productId
      const product = await this.productModel.findById(newItem.product).exec();

      if (!product) {
        throw new NotFoundException(
          `Sản phẩm với id ${newItem.product} không tồn tại`,
        );
      }

      // Kiểm tra biến thể có tồn tại trong product.variants không
      const variantExists = product.variants.some(
        (v) => v.toString() === newItem.variant,
      );

      if (!variantExists) {
        throw new NotFoundException(
          `Biến thể ${newItem.variant} không tồn tại trong sản phẩm ${product._id}`,
        );
      }
      const variant = this.variantModel.findById(newItem.variant);

      // Tìm xem item trong giỏ hàng đã có sản phẩm + biến thể
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === newItem.product &&
          item.variant.toString() === newItem.variant,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += newItem.quantity;
        cart.totalPrice =
          cart.items[itemIndex].quantity * (await variant).price;
      } else {
        cart.items.push({
          product: new Types.ObjectId(newItem.product),
          variant: new Types.ObjectId(newItem.variant),
          quantity: newItem.quantity,
          price: (await variant).price * newItem.quantity,
        });
      }
    }
    cart.totalQuantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    await cart.save();
    return cart;
  }

  findAll(user: IUser) {
    const cart = this.cartModel
      .findOne({ user: user._id })
      .populate({
        path: 'user',
        select: 'email name ',
      })
      .populate({
        path: 'items.product',
        select: 'name slug discount',
      })
      .populate({
        path: 'items.variant',
        select: 'sku images name price color memory',
      });
    return cart;
  }

  findOne(id: number) {
    return this.cartModel
      .findOne({ _id: id })
      .populate({
        path: 'user',
        select: 'email name ',
      })
      .populate({
        path: 'items.product',
        select: 'name slug',
      })
      .populate({
        path: 'items.variant',
        select: 'name price color memory',
      });
  }

  update(id: string, updateCartDto: UpdateCartDto) {
    return this.cartModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateCartDto,
      },
    );
  }

  async removeItemFromCart(user: IUser, productId: string, variantId: string) {
    // Tìm cart của user
    const cart = await this.cartModel.findOne({ user: user._id });

    if (!cart) {
      throw new NotFoundException(`Không tìm thấy giỏ hàng của người dùng.`);
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(`Không tìm thấy sản phẩm trong giỏ hàng.`);
    }

    cart.items.splice(itemIndex, 1);
    cart.totalQuantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

    await cart.save();
    return cart;
  }
}
