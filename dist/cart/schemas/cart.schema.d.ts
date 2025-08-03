import mongoose, { HydratedDocument, Types } from 'mongoose';
export type CartDocument = HydratedDocument<Cart>;
export declare class CartItem {
    product: Types.ObjectId;
    variant: Types.ObjectId;
    color: string;
    quantity: number;
    price: number;
    branch: Types.ObjectId;
}
export declare class Cart {
    user: Types.ObjectId;
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
}
export declare const CartSchema: mongoose.Schema<Cart, mongoose.Model<Cart, any, any, any, mongoose.Document<unknown, any, Cart> & Cart & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Cart, mongoose.Document<unknown, {}, mongoose.FlatRecord<Cart>> & mongoose.FlatRecord<Cart> & {
    _id: Types.ObjectId;
}>;
