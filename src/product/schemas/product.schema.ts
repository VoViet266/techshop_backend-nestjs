import mongoose, { HydratedDocument, Types } from 'mongoose';

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Brand } from 'src/brand/schemas/brand.schema';
import { Category } from 'src/category/schemas/category.schema';
import { Variant } from './variant.schema';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Type } from '@nestjs/common';
import { Promotion } from 'src/benefit/schemas/promotion.schema';
import { WarrantyPolicy } from 'src/benefit/schemas/warrantypolicy.schema';
export type ProductDocument = HydratedDocument<Products>;

export type CamerasDocument = HydratedDocument<Camera>;
export type ConnectivitiesDocument = HydratedDocument<Connectivity>;

@Schema({ _id: false, strict: true })
export class ProductSpecs {
  @Prop()
  displaySize: string;

  @Prop()
  displayType: string;

  @Prop()
  processor: string;

  @Prop()
  operatingSystem: string;

  @Prop()
  battery: string;

  @Prop()
  weight: string;
}

@Schema({ _id: false, strict: true })
export class Connectivity {
  @Prop()
  wifi: string;

  @Prop()
  bluetooth: string;

  @Prop()
  cellular: string;

  @Prop({ default: false })
  nfc: boolean;

  @Prop({ default: false })
  gps: boolean;

  @Prop()
  ports: string[];
}

@Schema({ _id: false, strict: true })
export class Camera {
  @Prop({ type: Object })
  front: {
    resolution: string;
    features: string[];
    videoRecording: string[];
  };

  @Prop({ type: Object })
  rear: {
    resolution: string;
    features: string[];
    lensCount: number;
    videoRecording: string[];
  };
}

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

  // @Prop({
  //   index: true,
  //   trim: true,
  // })
  // slug: string;

  // @Prop({
  //   required: true,
  //   unique: true,
  //   trim: true,
  // })
  // sku: string;

  @Prop({ trim: true })
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

// Compound indexes for better query performanc
ProductSchema.index({ isActive: 1, createdAt: -1 });
ProductSchema.index({ tags: 1, isActive: 1 });
ProductSchema.index({ slug: 1 }, { unique: true });

ProductSchema.plugin(softDeletePlugin); // Không cần options
