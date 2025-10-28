import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Brand } from 'src/brand/schemas/brand.schema';
import { Category } from 'src/category/schemas/category.schema';
import { Variant } from './variant.schema';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type ProductDocument = HydratedDocument<Products>;

@Schema({
  timestamps: true,
})
export class Products {
  @Prop({
    unique: true,
    index: true,
    trim: true,
  })
  name: string;


  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
    index: true,
  })
  category: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
    required: true,
    index: true,
  })
  brand: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Variant.name,
  })
  variants?: Variant[];

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  attributes: Record<string, any>;

  @Prop({
    type: [String],
    default: [],
  })
  galleryImages: string[];

  @Prop({
    default: 0,
    min: 0,
  })
  viewCount: number;

  @Prop({
    default: 0,
    min: 0,
  })
  soldCount: number;

  @Prop({
    default: 0,
    min: 0,
    max: 5,
  })
  averageRating: number;

  @Prop({
    default: 0,
    min: 0,
  })
  reviewCount: number;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({
    type: {
      email: String,
      name: String,
    },
  })
  createdBy: {
    email: string;
    name: string;
  };

  @Prop({
    type: {
      email: String,
      name: String,
    },
  })
  updatedBy: {
    email: string;
    name: string;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Products);
ProductSchema.index({ isActive: 1, createdAt: -1 });
ProductSchema.index({ tags: 1, isActive: 1 });
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.plugin(softDeletePlugin); // Không cần options
