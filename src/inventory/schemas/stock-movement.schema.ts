import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Branch } from 'src/branch/schemas/branch.schema';
import {
  TransactionSource,
  TransactionType,
} from 'src/constant/transaction.enum';
import { Products } from 'src/product/schemas/product.schema';
import { Variant } from 'src/product/schemas/variant.schema';

export type StockMovementDocument = HydratedDocument<StockMovement>;
@Schema({ timestamps: true })
export class StockMovement {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Products.name,
    required: true,
  })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Branch.name,
    required: true,
  })
  branchId: mongoose.Schema.Types.ObjectId;

  @Prop()
  quantity?: number;

  @Prop({
    type: [
      {
        variantId: { type: mongoose.Types.ObjectId, ref: Variant.name },
        stock: { type: Number },
        cost: { type: Number, default: 0, min: 0 },
      },
    ],
  })
  variants?: {
    variantId: mongoose.Types.ObjectId;
    stock: number;
    cost?: number;
  }[];
  @Prop({
    enum: TransactionType,
    required: true,
  })
  type: string;

  @Prop() note: string;

  @Prop({ type: String, enum: TransactionSource })
  relatedTo?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  relatedId?: string;

  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
    },
  })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
  };

  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
    },
  })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
  };
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);
