import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from '../benefit/schemas/promotion.schema';
import { WarrantyPolicy, WarrantyPolicyDocument } from '../benefit/schemas/warrantypolicy.schema';
export declare class ProductBenefitService {
    private promotionModel;
    private warrantyModel;
    constructor(promotionModel: Model<PromotionDocument>, warrantyModel: Model<WarrantyPolicyDocument>);
    createPromotion(data: Partial<Promotion>): Promise<import("mongoose").Document<unknown, {}, PromotionDocument> & Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllPromotions(): Promise<(import("mongoose").Document<unknown, {}, PromotionDocument> & Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getPromotionById(id: string): Promise<import("mongoose").Document<unknown, {}, PromotionDocument> & Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updatePromotion(id: string, data: Partial<Promotion>): Promise<import("mongoose").Document<unknown, {}, PromotionDocument> & Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deletePromotion(id: string): Promise<import("mongoose").Document<unknown, {}, PromotionDocument> & Promotion & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createWarrantyPolicy(data: Partial<WarrantyPolicy>): Promise<import("mongoose").Document<unknown, {}, WarrantyPolicyDocument> & WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllWarranties(): Promise<(import("mongoose").Document<unknown, {}, WarrantyPolicyDocument> & WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getWarrantyById(id: string): Promise<import("mongoose").Document<unknown, {}, WarrantyPolicyDocument> & WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateWarranty(id: string, data: Partial<WarrantyPolicy>): Promise<import("mongoose").Document<unknown, {}, WarrantyPolicyDocument> & WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteWarranty(id: string): Promise<import("mongoose").Document<unknown, {}, WarrantyPolicyDocument> & WarrantyPolicy & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
