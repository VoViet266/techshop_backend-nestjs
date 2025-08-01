import mongoose, { HydratedDocument, Types } from 'mongoose';
export type TransferDocument = HydratedDocument<Transfer>;
export declare class Transfer {
    fromBranchId: mongoose.Schema.Types.ObjectId;
    toBranchId: mongoose.Schema.Types.ObjectId;
    items: {
        productId: mongoose.Schema.Types.ObjectId;
        variantId: mongoose.Schema.Types.ObjectId;
        quantity: number;
        unit?: string;
    }[];
    status: string;
    approvedBy?: Types.ObjectId[];
    approvedAt?: Date;
    rejectNote?: string;
    note: string;
    createdBy: {
        email: string;
        name: string;
    };
    updatedBy: {
        email: string;
        name: string;
    };
}
export declare const TransferSchema: mongoose.Schema<Transfer, mongoose.Model<Transfer, any, any, any, mongoose.Document<unknown, any, Transfer> & Transfer & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Transfer, mongoose.Document<unknown, {}, mongoose.FlatRecord<Transfer>> & mongoose.FlatRecord<Transfer> & {
    _id: Types.ObjectId;
}>;
