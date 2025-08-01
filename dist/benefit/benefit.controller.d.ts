import { ProductBenefitService } from './benefit.service';
export declare class ProductBenefitController {
    private readonly benefitService;
    constructor(benefitService: ProductBenefitService);
    createPromotion(body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/promotion.schema").PromotionDocument> & import("./schemas/promotion.schema").Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllPromotions(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/promotion.schema").PromotionDocument> & import("./schemas/promotion.schema").Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getPromotionById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/promotion.schema").PromotionDocument> & import("./schemas/promotion.schema").Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updatePromotion(id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/promotion.schema").PromotionDocument> & import("./schemas/promotion.schema").Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deletePromotion(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/promotion.schema").PromotionDocument> & import("./schemas/promotion.schema").Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createWarranty(body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/warrantypolicy.schema").WarrantyPolicyDocument> & import("./schemas/warrantypolicy.schema").WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllWarranties(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/warrantypolicy.schema").WarrantyPolicyDocument> & import("./schemas/warrantypolicy.schema").WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getWarrantyById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/warrantypolicy.schema").WarrantyPolicyDocument> & import("./schemas/warrantypolicy.schema").WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateWarranty(id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/warrantypolicy.schema").WarrantyPolicyDocument> & import("./schemas/warrantypolicy.schema").WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteWarranty(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/warrantypolicy.schema").WarrantyPolicyDocument> & import("./schemas/warrantypolicy.schema").WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
