import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type VariantDocument = HydratedDocument<Variant>;
@Schema({
  timestamps: true,
  strict: true,
})
export class Variant {
  @Prop({
    required: true,
    index: true,
  })
  name: string;

  @Prop({
    min: 0,
  })
  price: number;

  @Prop({
    type: [
      {
        colorName: String,
        colorHex: String,
        images: [String], // mỗi màu có thể có bộ ảnh riêng
      },
    ],
  })
    color: {
      colorName: string;
      colorHex: string;
      images: string[];
    }[];
    @Prop({ type: Object })
    memory: {
      ram: string;
      storage: string;
    };

  @Prop({ default: 0 })
  weight: number; // For shipping calculations

  @Prop({ default: true })
  isActive: boolean;
}
export const VariantSchema = SchemaFactory.createForClass(Variant);
