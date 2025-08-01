export declare class CartItemDto {
    product?: string;
    quantity?: number;
    branch?: string;
    price?: number;
    variant?: string;
}
declare class RecipientDto {
    name: string;
    phone: string;
    address: string;
    note?: string;
}
export declare class CreateOrderDto {
    user?: string;
    recipient: RecipientDto;
    buyer?: RecipientDto;
    items?: CartItemDto[];
    totalPrice?: number;
    branch: string[];
    status?: string;
    source?: string;
    paymentStatus: string;
    payment: string;
    isReturn: boolean;
    returnStatus?: string;
    returnProcessedBy?: any;
    returnReason?: string;
    paymentMethod: string;
    phone: string;
}
export {};
