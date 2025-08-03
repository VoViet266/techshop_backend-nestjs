import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Variant } from './variant.schema';
export type ProductDocument = HydratedDocument<Products>;
export declare class Products {
    name: string;
    description: string;
    discount: number;
    category: mongoose.Schema.Types.ObjectId;
    brand: mongoose.Schema.Types.ObjectId;
    variants?: Variant[];
    attributes: Record<string, any>;
    galleryImages: string[];
    viewCount: number;
    soldCount: number;
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
    deletedAt: Date;
    createdBy: {
        email: string;
        name: string;
    };
    updatedBy: {
        email: string;
        name: string;
    };
}
export declare const ProductSchema: mongoose.Schema<Products, mongoose.Model<Products, any, any, any, mongoose.Document<unknown, any, Products> & Products & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Products, mongoose.Document<unknown, {}, mongoose.FlatRecord<Products>> & mongoose.FlatRecord<Products> & {
    _id: Types.ObjectId;
}>;
