import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type BannerDocument = HydratedDocument<Banner>;
@Schema()
export class Banner {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  imageUrl: string;
  @Prop()
  linkTo: string;
  @Prop()
  position: string; // e.g., 'top', 'bottom', 'sidebar'
  @Prop()
  isActive: boolean;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
}
export const BannerSchemas = SchemaFactory.createForClass(Banner);
