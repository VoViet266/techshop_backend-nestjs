export declare class VariantColorDto {
    colorName: string;
    colorHex: string;
    images?: string[];
}
export declare class VariantDto {
    name: string;
    price: number;
    memory: {
        ram: string;
        storage: string;
    };
    color: VariantColorDto[];
    isActive?: boolean;
}
export declare class CreateProductDto {
    name: string;
    description?: string;
    galleryImages?: string[];
    slug: string;
    category: string;
    brand: string;
    variants?: VariantDto[];
    discount: number;
    attributes?: Record<string, any>;
    viewCount?: number;
    averageRating?: number;
    reviewCount?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}
