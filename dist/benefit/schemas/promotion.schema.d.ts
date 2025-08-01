import { Document } from 'mongoose';
export type PromotionDocument = Promotion & Document;
export declare class Promotion {
    title: string;
    valueType: 'fixed' | 'percent';
    value: number;
    startDate: Date;
    endDate: Date;
    conditions: {
        minOrder?: number;
        payment?: string;
    };
    isActive: boolean;
}
export declare const PromotionSchema: import("mongoose").Schema<Promotion, import("mongoose").Model<Promotion, any, any, any, Document<unknown, any, Promotion> & Promotion & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Promotion, Document<unknown, {}, import("mongoose").FlatRecord<Promotion>> & import("mongoose").FlatRecord<Promotion> & {
    _id: import("mongoose").Types.ObjectId;
}>;
