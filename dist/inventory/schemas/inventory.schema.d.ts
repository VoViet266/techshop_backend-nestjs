import mongoose, { HydratedDocument } from 'mongoose';
export type InventoryDocument = HydratedDocument<Inventory>;
export declare class Inventory {
    branch: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId;
    variants: {
        variantId: mongoose.Types.ObjectId;
        stock: number;
        cost?: number;
    }[];
    minStockLevel: number;
    maxStockLevel: number;
    lastRestockedAt: Date;
    isActive: boolean;
    lastUpdatedBy: {
        email: string;
        name: string;
    };
    createdBy: {
        email: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const InventorySchema: mongoose.Schema<Inventory, mongoose.Model<Inventory, any, any, any, mongoose.Document<unknown, any, Inventory> & Inventory & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Inventory, mongoose.Document<unknown, {}, mongoose.FlatRecord<Inventory>> & mongoose.FlatRecord<Inventory> & {
    _id: mongoose.Types.ObjectId;
}>;
