import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({
    type: Object,
  })
  createdBy: {
    _id: string; 
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: string; 
    email: string;
  };
}

export const CategorySchema = SchemaFactory.createForClass(Category);
