import mongoose, { HydratedDocument } from 'mongoose';
export type BranchDocument = HydratedDocument<Branch>;
export declare class Branch {
    name: string;
    address: string;
    manager: mongoose.Schema.Types.ObjectId;
    location: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
}
export declare const BranchSchema: mongoose.Schema<Branch, mongoose.Model<Branch, any, any, any, mongoose.Document<unknown, any, Branch> & Branch & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Branch, mongoose.Document<unknown, {}, mongoose.FlatRecord<Branch>> & mongoose.FlatRecord<Branch> & {
    _id: mongoose.Types.ObjectId;
}>;
