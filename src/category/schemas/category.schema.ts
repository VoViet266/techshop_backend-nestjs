import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  slug: string; // URL-friendly version of name

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({
    type: Object,
  })
  createdBy: {
    _id: string; // Assuming _id is a string, adjust if it's an ObjectId
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: string; // Assuming _id is a string, adjust if it's an ObjectId
    email: string;
  };
}

export const CategorySchema = SchemaFactory.createForClass(Category);
