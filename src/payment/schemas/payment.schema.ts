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

  @Prop()
  momoOrderId?: string;
  @Prop()
  momoRequestId?: string;

  @Prop()
  requestId?: string;

  @Prop()
  momoTransId: string;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop({ enum: PaymentMethod })
  payType: string;

  @Prop()
  amount: number;

  @Prop()
  message: string;

  @Prop()
  paymentTime: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
