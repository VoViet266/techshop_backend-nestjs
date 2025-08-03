import { HydratedDocument } from 'mongoose';
export type VariantDocument = HydratedDocument<Variant>;
export declare class Variant {
    name: string;
    price: number;
    color: {
        colorName: string;
        colorHex: string;
        images: string[];
    }[];
    memory: {
        ram: string;
        storage: string;
    };
    imagesMain: string;
    weight: number;
    isActive: boolean;
}
export declare const VariantSchema: import("mongoose").Schema<Variant, import("mongoose").Model<Variant, any, any, any, import("mongoose").Document<unknown, any, Variant> & Variant & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Variant, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Variant>> & import("mongoose").FlatRecord<Variant> & {
    _id: import("mongoose").Types.ObjectId;
}>;
