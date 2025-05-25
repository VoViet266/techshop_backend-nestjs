import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Brand } from 'src/brand/entities/brand.schema';
import { Category } from 'src/category/entities/category.schema';
export type ProductDocument = HydratedDocument<Products>;
export type VariantDocument = HydratedDocument<Variants>;
export type CamerasDocument = HydratedDocument<Cameras>;
export type ConnectivitiesDocument = HydratedDocument<Connectivities>;
@Schema()
export class Variants {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  ram: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  storage: string;

  @Prop()
  image: string[];

  @Prop({ default: true })
  isActive: boolean;
}

@Schema({
  timestamps: true,
})
export class Connectivities {
  @Prop()
  wifi: string;

  @Prop()
  bluetooth: string;

  @Prop()
  network: string;

  @Prop()
  nfc: boolean;

  @Prop()
  gps: boolean;

  @Prop()
  usb: string;
}

@Schema({
  timestamps: true,
})
export class Cameras {
  @Prop()
  frontCamera: string;

  @Prop()
  rearCamera: string;

  @Prop()
  videoRecording: string;
}
@Schema({
  timestamps: true,
})
export class Products {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Brand.name,
    required: true,
  })
  brand: MongooseSchema.Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: Variants.name })
  variants: MongooseSchema.Types.ObjectId[];
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Connectivities.name })
  connectivities: MongooseSchema.Types.ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Cameras.name })
  cameras: MongooseSchema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const VariantSchema = SchemaFactory.createForClass(Variants);
export const ConnectivitiesSchema =
  SchemaFactory.createForClass(Connectivities);
export const CamerasSchema = SchemaFactory.createForClass(Cameras);
export const ProductSchema = SchemaFactory.createForClass(Products);
