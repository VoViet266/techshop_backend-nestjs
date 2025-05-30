import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PromotionDocument = HydratedDocument<Promotion>;
@Schema()
export class Promotion {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  discountType: string;
  @Prop()
  discountValue: number;
  @Prop()
  maxDiscountValue: number;
  @Prop()
  startDate: Date;
  @Prop()
  isForNewUsersOnly: boolean;
  @Prop()
  isActive: boolean;
}
export const PromotionSchema = SchemaFactory.createForClass(Promotion);
