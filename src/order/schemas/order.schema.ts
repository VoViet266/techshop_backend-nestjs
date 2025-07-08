import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Branch } from 'src/branch/schemas/branch.schema';
import { OrderStatus } from 'src/constant/orderStatus.enum';
import {
  OrderSource,
  PaymentMethod,
  PaymentStatus,
} from 'src/constant/payment.enum';
import { Payment } from 'src/payment/schemas/payment.schema';
import { Products } from 'src/product/schemas/product.schema';
import { Variant } from 'src/product/schemas/variant.schema';

import { User } from 'src/user/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;
@Schema({
  timestamps: true,
})
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Products.name,
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Variant.name,
          required: true,
        },
      },
    ],
  })
  items: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    variant: mongoose.Schema.Types.ObjectId;
  }[];

  @Prop({ enum: OrderSource })
  source: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Branch.name,
  })
  branch?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  totalPrice: number;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' })
  payment: Types.ObjectId;

  @Prop({ type: String })
  shippingAddress: string;

  @Prop({ enum: PaymentMethod })
  paymentMethod: string;

  @Prop({ type: String })
  phone: string;

  @Prop()
  createdAt: Date;

  @Prop({
    type: Object,
  })
  createdBy: {
    name: string;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    name: string;
    email: string;
  };
}
export const OrderSchema = SchemaFactory.createForClass(Order);
