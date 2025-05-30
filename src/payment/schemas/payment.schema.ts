import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from '../../constant/payment.enum';
import { Order } from 'src/order/schemas/order.schema';
import { User } from 'src/user/schemas/user.schema';
// Removed unused import for PaymentService

export type PaymentDocument = HydratedDocument<Payment>;
@Schema({ timestamps: true })
export class Payment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  order: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: string;

  @Prop({ required: true, default: PaymentStatus.PENDING, enum: PaymentStatus })
  paymentStatus: string;

  @Prop()
  transactionCode: string;

  @Prop()
  transactionDate: Date;

  // @Prop({ default: RefundStatus.NONE, enum: RefundStatus })
  // refundStatus: RefundStatus;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
