import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ViewHistoryDocument = HydratedDocument<ViewHistory>;
@Schema({ timestamps: true })
export class ViewHistory {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ default: Date.now })
  viewedAt: Date;
}

export const ViewHistorySchema = SchemaFactory.createForClass(ViewHistory);
