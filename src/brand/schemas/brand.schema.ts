import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;
@Schema({
  timestamps: true,
})
export class Brand {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop()
  description: string;
  @Prop({})
  logo: string;

  @Prop({ default: true })
  isActive: boolean;
}
export const BrandSchema = SchemaFactory.createForClass(Brand);
