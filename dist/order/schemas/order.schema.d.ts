import mongoose, { HydratedDocument, Types } from 'mongoose';
export type OrderDocument = HydratedDocument<Order>;
export declare class Order {
    user?: mongoose.Schema.Types.ObjectId;
    recipient: {
        name: string;
        phone: string;
        address: string;
        note?: string;
    };
    buyer: {
        name: string;
        phone: string;
        address: string;
    };
    items: {
        product: mongoose.Schema.Types.ObjectId;
        quantity: number;
        price: number;
        variant: mongoose.Schema.Types.ObjectId;
        variantColor: string;
        branch: mongoose.Schema.Types.ObjectId;
    }[];
    appliedPromotions: {
        promotionId: mongoose.Schema.Types.ObjectId;
        title: string;
        valueType: 'percent' | 'fixed';
        value: number;
        discountAmount: number;
    }[];
    discountAmount: number;
    source: string;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    payment: Types.ObjectId;
    paymentMethod: string;
    isReturned: boolean;
    returnStatus: string;
    returnReason: string;
    returnProcessedBy?: {
        name: string;
        email: string;
    };
    createdAt: Date;
    createdBy: {
        name: string;
        email: string;
    };
    updatedBy: {
        name: string;
        email: string;
    };
}
export declare const OrderSchema: mongoose.Schema<Order, mongoose.Model<Order, any, any, any, mongoose.Document<unknown, any, Order> & Order & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Order, mongoose.Document<unknown, {}, mongoose.FlatRecord<Order>> & mongoose.FlatRecord<Order> & {
    _id: Types.ObjectId;
}>;
