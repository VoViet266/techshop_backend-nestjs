export declare class VariantColorDto {
    name: string;
    hex: string;
}
export declare class VariantMemoryDto {
    ram: string;
    storage: string;
}
export declare class VariantDto {
    name?: string;
    price?: number;
    color?: VariantColorDto;
    memory?: VariantMemoryDto;
    images: string[];
    weight?: number;
    isActive?: boolean;
}
export declare class CreateProductDto {
    name: string;
    description?: string;
    galleryImages: string;
    slug: string;
    promotions?: string[];
    warranties?: string[];
    category: string;
    brand: string;
    variants?: VariantDto[];
    discount: number;
    attributes?: Record<string, any>;
    tags?: string[];
    viewCount?: number;
    averageRating?: number;
    reviewCount?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}
