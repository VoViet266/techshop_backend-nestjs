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
        stock: { type: Number },
        cost: { type: Number, default: 0, min: 0 },
      },
    ],
  })
  variants: {
    variantId: mongoose.Types.ObjectId;
    stock: number;
    cost?: number;
  }[];



  // Trạng thái hoạt động của tồn kho
  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean;

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
