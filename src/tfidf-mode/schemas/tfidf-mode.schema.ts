import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type TfidfModelDocument = HydratedDocument<TfidfModel>;
@Schema({ timestamps: true })
export class TfidfModel {
  @Prop({ required: true, type: [String] })
  vocabulary: string[];

  @Prop({ required: true, type: Object })
  productVectors: Record<string, number[]>;

  @Prop({ default: Date.now })
  trainedAt: Date;
}

export const TfidfModelSchema = SchemaFactory.createForClass(TfidfModel);
