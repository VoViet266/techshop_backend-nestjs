import { RecommendationService } from './recommendation.service';
import { RecordDto } from './dto/record.dto';
export declare class RecommendationController {
    private readonly recommendationService;
    constructor(recommendationService: RecommendationService);
    getRecommendedProducts(productId: string, limit?: string): Promise<import("../product/schemas/product.schema").Products[]>;
    recordViewHistory(recordDto: RecordDto): Promise<void>;
    getRecommendationsByUser(userId: string): Promise<import("../product/schemas/product.schema").Products[]>;
    getPopularProducts(limit?: string): Promise<import("../product/schemas/product.schema").Products[]>;
    getBrandBasedRecommendations(brandId: string, limit?: string): Promise<import("../product/schemas/product.schema").Products[]>;
    getCategoryBasedRecommendations(categoryId: string, limit?: string): Promise<import("../product/schemas/product.schema").Products[]>;
}
