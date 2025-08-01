export declare class RequestReturnDto {
    returnReason: string;
    returnedItems?: {
        product: string;
        variant: string;
        quantity: number;
        refundAmount?: number;
    }[];
}
