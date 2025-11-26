import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';

export type WarrantyPolicyDocument = WarrantyPolicy & Document;

@Schema({ timestamps: true })
export class WarrantyPolicy {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop() // Thời gian bảo hành tính theo tháng
  durationMonths: number;

  @Prop({ default: 0 }) // Giá nếu là bảo hành mở rộng
  price: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    default: [],
  })
  categories: mongoose.Schema.Types.ObjectId[];
}

export const WarrantyPolicySchema =
  SchemaFactory.createForClass(WarrantyPolicy);
