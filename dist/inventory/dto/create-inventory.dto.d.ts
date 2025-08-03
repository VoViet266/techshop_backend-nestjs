export declare class VariantDto {
    variantId: string;
    stock: number;
    cost: number;
}
export declare class CreateInventoryDto {
    branch: string;
    product: string;
    variants: VariantDto[];
}
export declare class CreateStockMovementDto {
    branchId: string;
    productId: string;
    variants: {
        variantId: string;
        variantColor: string;
        quantity: number;
        cost?: number;
    }[];
    note?: string;
    source?: string;
}
export declare class CreateTransferDto {
    fromBranchId: string;
    toBranchId: string;
    items: {
        productId: string;
        variantId: string;
        variantColor: string;
        quantity: number;
        unit?: string;
    }[];
    approvedBy?: string;
    approvedAt?: Date;
    rejectNote?: string;
    status: string;
    note?: string;
}
