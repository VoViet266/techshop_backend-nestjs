import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Branch } from 'src/branch/schemas/branch.schema';
import { Products } from 'src/product/schemas/product.schema';
import { Variant } from 'src/product/schemas/variant.schema';
import { User } from 'src/user/schemas/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ _id: false })
export class CartItem {
  @Prop({
    type: Types.ObjectId,
    ref: Products.name,
    required: true,
  })
  product: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Variant.name,
    required: true,
  })
  variant: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  quantity: number;

  @Prop()
  price: number;

  @Prop({
    type: Types.ObjectId,
    ref: Branch.name,
    required: true,
  })
  branch: Types.ObjectId;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ default: 0 })
  totalQuantity: number;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
