import mongoose, { HydratedDocument } from 'mongoose';
export type CategoryDocument = HydratedDocument<Category>;
export declare class Category {
    name: string;
    description: string;
    slug: string;
    logo: string;
    configFields: {
        specifications?: boolean;
        camera?: boolean;
        connectivity?: boolean;
        extraFields?: Array<{
            label: string;
            name: string;
            type: 'text' | 'number' | 'select' | 'checkbox';
            options?: string[];
            required?: boolean;
            section?: 'specifications' | 'camera' | 'connectivity' | 'general';
            filterable?: boolean;
        }>;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
        _id: string;
        email: string;
    };
    updatedBy: {
        _id: string;
        email: string;
    };
}
export declare const CategorySchema: mongoose.Schema<Category, mongoose.Model<Category, any, any, any, mongoose.Document<unknown, any, Category> & Category & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Category, mongoose.Document<unknown, {}, mongoose.FlatRecord<Category>> & mongoose.FlatRecord<Category> & {
    _id: mongoose.Types.ObjectId;
}>;
