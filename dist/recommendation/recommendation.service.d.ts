import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Products, ProductDocument } from 'src/product/schemas/product.schema';
import { ViewHistoryDocument } from './schemas/view_histories.schema';
import { TfidfModelDocument } from 'src/tfidf-mode/schemas/tfidf-mode.schema';
interface ModelStatus {
    isModelTrained: boolean;
    lastTrainingTime: Date | null;
    vocabularySize: number;
    productCount: number;
    modelSource: 'database' | 'memory' | 'none';
}
export declare class RecommendationService implements OnModuleInit {
    private readonly productModel;
    private readonly viewHistoryModel;
    private readonly tfidfModelModel;
    private readonly logger;
    private tfidf;
    private productVectors;
    private vocabulary;
    private isModelTrained;
    private lastTrainingTime;
    private isTraining;
    private modelSource;
    constructor(productModel: SoftDeleteModel<ProductDocument>, viewHistoryModel: SoftDeleteModel<ViewHistoryDocument>, tfidfModelModel: Model<TfidfModelDocument>);
    onModuleInit(): Promise<void>;
    scheduledModelUpdate(): Promise<void>;
    loadModelFromDatabase(): Promise<boolean>;
    saveModelToDatabase(): Promise<void>;
    trainTfIdfModel(): Promise<void>;
    private extractProductFeatures;
    private tokenizeText;
    private createProductVector;
    private calculateCosineSimilarity;
    getRecommendedProducts(productId: string, limit?: number, minSimilarity?: number): Promise<Products[]>;
    getRecommendationsForUser(userId: string, limit?: number): Promise<Products[]>;
    getPopularProducts(limit: number): Promise<Products[]>;
    private getUserInteractedProducts;
    forceRetrainModel(): Promise<void>;
    clearSavedModel(): Promise<void>;
    getModelStatus(): ModelStatus;
    recordViewHistory(userId: string, productId: string): Promise<void>;
    getRecommendationsFromViewedProducts(productIds: string[], limit?: number, excludeIds?: string[]): Promise<Products[]>;
    getCategoryBasedRecommendations(categoryId: string, limit?: number, excludeIds?: string[]): Promise<Products[]>;
    getBrandBasedRecommendations(brandId: string, limit?: number, excludeIds?: string[]): Promise<Products[]>;
}
export {};
