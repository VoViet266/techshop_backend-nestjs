import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const WarrantyPolicySchema =
  SchemaFactory.createForClass(WarrantyPolicy);
