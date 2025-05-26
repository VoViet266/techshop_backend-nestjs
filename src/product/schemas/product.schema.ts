import mongoose, { HydratedDocument } from 'mongoose';

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Brand } from 'src/brand/entities/brand.schema';
import { Category } from 'src/category/entities/category.schema';
export type ProductDocument = HydratedDocument<Products>;
export type VariantDocument = HydratedDocument<Variant>;
export type CamerasDocument = HydratedDocument<Camera>;
export type ConnectivitiesDocument = HydratedDocument<Connectivity>;

// Embedded schemas for better performance
@Schema({ _id: false })
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

  @Prop()
  dimensions: string;
}

@Schema({ _id: false })
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

@Schema({ _id: false })
export class Camera {
  @Prop({ type: Object })
  front: {
    resolution: string;
    features: string[];
  };

  @Prop({ type: Object })
  rear: {
    resolution: string;
    features: string[];
    lensCount: number;
  };

  @Prop()
  videoRecording: string[];
}

@Schema()
export class Variant {
  @Prop()
  sku: string; // Stock Keeping Unit for better inventory tracking

  @Prop()
  name: string;

  @Prop({
    min: 0,
  })
  price: number;

  @Prop({
    min: 0,
  })
  compareAtPrice: number; // For showing discounts

  @Prop({ type: Object })
  color: {
    name: string;
    hex: string; // Color hex code
  };

  @Prop({ type: Object })
  memory: {
    ram: string;
    storage: string;
  };

  @Prop({
    type: [String],
    // validate: {
    //   validator: function (v: string[]) {
    //     return v && v.length > 0;
    //   },
    //   message: 'At least one image is required',
    // },
  })
  images: string[];

  @Prop({ default: 0 })
  weight: number; // For shipping calculations

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({
  timestamps: true,
})
export class Products {
  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    index: true,
    trim: true,
  })
  slug: string; // URL-friendly version of name

  @Prop({ trim: true })
  description: string;

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
  variants: Variant[];

  @Prop({ type: ProductSpecs })
  specifications: ProductSpecs;

  @Prop({ type: Connectivity })
  connectivity: Connectivity;

  @Prop({ type: Camera })
  camera: Camera;

  @Prop({
    type: [String],
    index: true,
  })
  tags: string[]; // For search and filtering

  @Prop({
    default: 0,
    min: 0,
  })
  viewCount: number;

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
    index: true,
  })
  isActive: boolean;

  @Prop({
    default: false,
    index: true,
  })
  isFeatured: boolean;

  @Prop({
    default: false,
    index: true,
  })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt: Date;

  // Audit fields
  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
    },
    required: true,
  })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
  };

  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
    },
  })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Products);
export const VariantSchema = SchemaFactory.createForClass(Variant);

// Compound indexes for better query performance
ProductSchema.index({ category: 1, brand: 1, isActive: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1, createdAt: -1 });
ProductSchema.index({ tags: 1, isActive: 1 });
ProductSchema.index({ 'variants.sku': 1 }, { unique: true });
ProductSchema.index({ slug: 1 }, { unique: true });
