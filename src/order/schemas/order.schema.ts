import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Products, Variant } from 'src/product/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;
@Schema({
  timestamps: true,
})
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

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
    required: true,
  })
  items: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    variant: mongoose.Schema.Types.ObjectId;
  }[];

  @Prop({ type: Number, required: true, default: 0 })
  totalPrice: number;

  @Prop({
    type: String,
    required: true,
    // enum: {
    // },
    // default: OrderStatus.pending,
  })
  status: string;
  @Prop({ type: String, required: true })
  shippingAddress: string;

  @Prop({ type: String, required: true })
  paymentMethod: string;

  @Prop()
  createdAt: Date;

  @Prop({
    type: Object,
  })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}
export const OrderSchema = SchemaFactory.createForClass(Order);
