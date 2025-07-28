import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Promotion } from 'src/benefit/schemas/promotion.schema';
import { WarrantyPolicy } from 'src/benefit/schemas/warrantypolicy.schema';
import { Branch } from 'src/branch/schemas/branch.schema';
import { OrderStatus } from 'src/constant/orderStatus.enum';
import {
  OrderSource,
  PaymentMethod,
  PaymentStatus,
} from 'src/constant/payment.enum';

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
    type: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      note: { type: String },
    },
  })
  recipient: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  @Prop({
    type: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
  })
  buyer: {
    name: string;
    phone: string;
    address: string;
  };

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
        branch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Branch.name,
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
    branch: mongoose.Schema.Types.ObjectId;
  }[];

  @Prop({
    type: [
      {
        promotionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Promotion.name,
        },
        title: { type: String },
        valueType: { type: String, enum: ['percent', 'fixed'] },
        value: { type: Number },
        discountAmount: { type: Number },
      },
    ],
    default: [],
  })
  appliedPromotions: {
    promotionId: mongoose.Schema.Types.ObjectId;
    title: string;
    valueType: 'percent' | 'fixed';
    value: number;
    discountAmount: number;
  }[];
  @Prop()
  discountAmount: number;
  @Prop({ enum: OrderSource })
  source: string;

  @Prop({ type: Number, required: true, default: 0 })
  totalPrice: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' })
  payment: Types.ObjectId;

  @Prop({ enum: PaymentMethod })
  paymentMethod: string;

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
