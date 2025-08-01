import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Variant } from './variant.schema';
export type ProductDocument = HydratedDocument<Products>;
export type CamerasDocument = HydratedDocument<Camera>;
export type ConnectivitiesDocument = HydratedDocument<Connectivity>;
export declare class ProductSpecs {
    displaySize: string;
    displayType: string;
    processor: string;
    operatingSystem: string;
    battery: string;
    weight: string;
}
export declare class Connectivity {
    wifi: string;
    bluetooth: string;
    cellular: string;
    nfc: boolean;
    gps: boolean;
    ports: string[];
}
export declare class Camera {
    front: {
        resolution: string;
        features: string[];
        videoRecording: string[];
    };
    rear: {
        resolution: string;
        features: string[];
        lensCount: number;
        videoRecording: string[];
    };
}
export declare class Products {
    name: string;
    slug: string;
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
    isFeatured: boolean;
    isDeleted: boolean;
    deletedAt: Date;
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string;
    };
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string;
    };
}
export declare const ProductSchema: mongoose.Schema<Products, mongoose.Model<Products, any, any, any, mongoose.Document<unknown, any, Products> & Products & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Products, mongoose.Document<unknown, {}, mongoose.FlatRecord<Products>> & mongoose.FlatRecord<Products> & {
    _id: Types.ObjectId;
}>;
