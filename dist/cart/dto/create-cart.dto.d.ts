import { Types } from 'mongoose';
export declare class CartItemDto {
    product: string;
    variant: Types.ObjectId | string;
    color: string;
    quantity: number;
    price?: number;
    branch: string;
}
export declare class CreateCartDto {
    user: Types.ObjectId | string;
    items: CartItemDto[];
    totalQuantity?: number;
    totalPrice?: number;
}
