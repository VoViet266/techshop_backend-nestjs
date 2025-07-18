import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  slug: string;

  @Prop()
  logo: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  configFields: {
    specifications?: boolean;
    camera?: boolean;
    connectivity?: boolean;
    extraFields?: Array<{
      label: string;
      name: string;
      type: 'text' | 'number' | 'select' | 'checkbox';
      options?: string[];
      required?: boolean;
      section?: 'specifications' | 'camera' | 'connectivity' | 'general';
      filterable?: boolean;
    }>;
  };

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
  