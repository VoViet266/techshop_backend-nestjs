import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Products } from 'src/product/schemas/product.schema';
import { Branch } from 'src/branch/schemas/branch.schema';
import mongoose, { HydratedDocument } from 'mongoose';
import { min } from 'class-validator';
import { Variant } from 'src/product/schemas/variant.schema';

export type InventoryDocument = HydratedDocument<Inventory>;
@Schema({
  timestamps: true,
})
export class Inventory {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Branch.name,
    required: true,
    index: true,
  })
  branch: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Products.name,
    required: true,
    index: true,
  })
  product: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    _id: false,
    type: [
      {
        variantId: { type: mongoose.Types.ObjectId, ref: Variant.name },
        variantColor: { type: String },
        stock: { type: Number },
        cost: { type: Number, default: 0, min: 0 },
      },
    ],
  })
  variants: {
    variantId: mongoose.Types.ObjectId;
    variantColor: string;
    stock: number;
    cost?: number;
  }[];

  // Thời gian nhập hàng gần nhất
  @Prop({ type: Date })
  lastRestockedAt: Date;

  // Trạng thái hoạt động của tồn kho
  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean;

  // Thông tin người cập nhật cuối cùng
  @Prop({
    type: {
      email: String,
      name: String,
    },
  })
  lastUpdatedBy: {
    email: string;
    name: string;
  };

  @Prop({
    type: {
      email: String,
      name: String,
    },
  })
  createdBy: {
    email: string;
    name: string;
  };

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}
export const InventorySchema = SchemaFactory.createForClass(Inventory);
