import { Document } from 'mongoose';
export type WarrantyPolicyDocument = WarrantyPolicy & Document;
export declare class WarrantyPolicy {
    name: string;
    description: string;
    durationMonths: number;
    price: number;
}
export declare const WarrantyPolicySchema: import("mongoose").Schema<WarrantyPolicy, import("mongoose").Model<WarrantyPolicy, any, any, any, Document<unknown, any, WarrantyPolicy> & WarrantyPolicy & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WarrantyPolicy, Document<unknown, {}, import("mongoose").FlatRecord<WarrantyPolicy>> & import("mongoose").FlatRecord<WarrantyPolicy> & {
    _id: import("mongoose").Types.ObjectId;
}>;
