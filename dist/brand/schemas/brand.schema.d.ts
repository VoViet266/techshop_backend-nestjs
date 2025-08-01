import { HydratedDocument } from 'mongoose';
export type BrandDocument = HydratedDocument<Brand>;
export declare class Brand {
    name: string;
    description: string;
    logo: string;
    isActive: boolean;
}
export declare const BrandSchema: import("mongoose").Schema<Brand, import("mongoose").Model<Brand, any, any, any, import("mongoose").Document<unknown, any, Brand> & Brand & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Brand, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Brand>> & import("mongoose").FlatRecord<Brand> & {
    _id: import("mongoose").Types.ObjectId;
}>;
