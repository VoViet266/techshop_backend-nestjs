import mongoose, { HydratedDocument, Types } from 'mongoose';
export type StockMovementDocument = HydratedDocument<StockMovement>;
export declare class StockMovement {
    productId: mongoose.Schema.Types.ObjectId;
    branchId: mongoose.Schema.Types.ObjectId;
    quantity?: number;
    variants?: {
        variantId: mongoose.Types.ObjectId;
        variantColor: string;
        quantity: number;
        cost?: number;
    }[];
    type: string;
    source: string;
    relatedId?: string;
    createdBy: {
        email: string;
        name: string;
    };
    updatedBy: {
        email: string;
        name: string;
    };
}
export declare const StockMovementSchema: mongoose.Schema<StockMovement, mongoose.Model<StockMovement, any, any, any, mongoose.Document<unknown, any, StockMovement> & StockMovement & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, StockMovement, mongoose.Document<unknown, {}, mongoose.FlatRecord<StockMovement>> & mongoose.FlatRecord<StockMovement> & {
    _id: Types.ObjectId;
}>;
