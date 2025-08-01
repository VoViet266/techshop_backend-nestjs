import mongoose, { HydratedDocument } from 'mongoose';
export type RoleDocument = HydratedDocument<Role>;
export declare class Role {
    name: string;
    description: string;
    permissions: mongoose.Schema.Types.ObjectId[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}
export declare const RoleSchema: mongoose.Schema<Role, mongoose.Model<Role, any, any, any, mongoose.Document<unknown, any, Role> & Role & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Role, mongoose.Document<unknown, {}, mongoose.FlatRecord<Role>> & mongoose.FlatRecord<Role> & {
    _id: mongoose.Types.ObjectId;
}>;
