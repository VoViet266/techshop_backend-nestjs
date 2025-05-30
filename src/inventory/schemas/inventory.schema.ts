import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Products } from 'src/product/schemas/product.schema';
import { Store } from 'src/store/schemas/store.schema';
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
    ref: Store.name,
    required: true,
    index: true,
  })
  store: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Products.name,
    required: true,
    index: true,
  })
  product: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: [
      {
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Variant.name,
          required: true,
        },
        stock: { type: Number },
        cost: { type: Number, default: 0, min: 0 },
      },
    ],
  })
  variants: {
    variantId: mongoose.Schema.Types.ObjectId;
    stock: number;
    // Giá vốn để tính lợi nhuận
    cost: number;
  }[];

  // Mức tồn kho tối thiểu để cảnh báo
  @Prop({
    default: 0,
    min: 0,
  })
  minStockLevel: number;

  // Mức tồn kho tối đa
  @Prop({
    default: 0,
    min: 0,
  })
  maxStockLevel: number;

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
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
    },
  })
  lastUpdatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
  };
}

// Tạo schema từ class Inventory
export const InventorySchema = SchemaFactory.createForClass(Inventory);

// // Tạo các chỉ mục (index) cho schema để tối ưu truy vấn
InventorySchema.index(
  { store: 1, product: 1, variantSku: 1 },
  { unique: true },
);
InventorySchema.index({ store: 1, product: 1, quantity: 1, isActive: 1 });
InventorySchema.index({ quantity: 1, minStockLevel: 1, isActive: 1 });
