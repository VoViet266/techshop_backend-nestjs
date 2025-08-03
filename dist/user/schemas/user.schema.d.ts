import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    email: string;
    password: string;
    name: string;
    role: mongoose.Schema.Types.ObjectId;
    avatar?: string;
    phone: string;
    gender: string;
    addresses: {
        specificAddress: string;
        addressDetail: string;
        default: boolean;
    }[];
    branch: mongoose.Schema.Types.ObjectId;
    age: number;
    isActive: boolean;
    refreshToken: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
}>;
