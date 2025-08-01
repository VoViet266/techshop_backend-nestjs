import { Document, HydratedDocument } from 'mongoose';
export type TfidfModelDocument = HydratedDocument<TfidfModel>;
export declare class TfidfModel {
    vocabulary: string[];
    productVectors: Record<string, number[]>;
    trainedAt: Date;
}
export declare const TfidfModelSchema: import("mongoose").Schema<TfidfModel, import("mongoose").Model<TfidfModel, any, any, any, Document<unknown, any, TfidfModel> & TfidfModel & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TfidfModel, Document<unknown, {}, import("mongoose").FlatRecord<TfidfModel>> & import("mongoose").FlatRecord<TfidfModel> & {
    _id: import("mongoose").Types.ObjectId;
}>;
