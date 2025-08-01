import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReviewService } from 'src/review/review.service';
export declare class ProductController {
    private readonly productService;
    private readonly reviewService;
    constructor(productService: ProductService, reviewService: ReviewService);
    create(createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Products> & import("./schemas/product.schema").Products & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Products> & import("./schemas/product.schema").Products & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(currentPage: string, limit: string, qs: string): Promise<{
        meta: {
            currentPage: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: object[];
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Products> & import("./schemas/product.schema").Products & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Products> & import("./schemas/product.schema").Products & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    autocomplete(query: string): Promise<string | any[]>;
    getRatingStats(productId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        deleted: number;
    }>;
    setViewCount(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    setOrderCount(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
}
