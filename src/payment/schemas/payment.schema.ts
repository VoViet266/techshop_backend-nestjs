import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Order } from 'src/order/schemas/order.schema';
import { User } from 'src/user/schemas/user.schema';

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

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true, default: 'pending' })
  paymentStatus: 'pending' | 'success' | 'failed';

  @Prop()
  transactionCode: string;

  @Prop()
  transactionDate: Date;

  @Prop({ default: 'none' })
  refundStatus: 'none' | 'processing' | 'completed' | 'failed';
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
