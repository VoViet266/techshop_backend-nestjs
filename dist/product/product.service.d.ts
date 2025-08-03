import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products, ProductDocument } from './schemas/product.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InventoryDocument } from 'src/inventory/schemas/inventory.schema';
import { VariantDocument } from './schemas/variant.schema';
import Redis from 'ioredis';
export declare class ProductService {
    private readonly productModel;
    private readonly variantModel;
    private readonly inventoryModel;
    private readonly redisClient;
    constructor(productModel: SoftDeleteModel<ProductDocument>, variantModel: SoftDeleteModel<VariantDocument>, inventoryModel: SoftDeleteModel<InventoryDocument>, redisClient: Redis);
    create(createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Products> & Products & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Products> & Products & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    insertManyProduct(createProductDtos: CreateProductDto[]): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Products> & Products & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Products> & Products & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, Omit<{
        slug: string;
        variants: import("mongoose").Types.ObjectId[];
        name: string;
        description?: string;
        galleryImages?: string[];
        category: string;
        brand: string;
        discount: number;
        attributes?: Record<string, any>;
        viewCount?: number;
        averageRating?: number;
        reviewCount?: number;
        isActive?: boolean;
        isFeatured?: boolean;
    }, "_id">>[]>;
    autocompleteSearch(query: string): Promise<string | any[]>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            currentPage: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: object[];
    }>;
    findOneById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Products> & Products & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Products> & Products & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        message: string;
    }>;
    countViews(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    countOrders(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): Promise<{
        deleted: number;
    }>;
}
