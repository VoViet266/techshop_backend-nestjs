import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;
@Schema({
  timestamps: true,
})
export class Brand {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  logo: string;
}
export const BrandSchema = SchemaFactory.createForClass(Brand);
