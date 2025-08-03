"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RecommendationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const mongoose_2 = require("mongoose");
const natural = __importStar(require("natural"));
const product_schema_1 = require("../product/schemas/product.schema");
const view_histories_schema_1 = require("./schemas/view_histories.schema");
const tfidf_mode_schema_1 = require("../tfidf-mode/schemas/tfidf-mode.schema");
let RecommendationService = RecommendationService_1 = class RecommendationService {
    constructor(productModel, viewHistoryModel, tfidfModelModel) {
        this.productModel = productModel;
        this.viewHistoryModel = viewHistoryModel;
        this.tfidfModelModel = tfidfModelModel;
        this.logger = new common_1.Logger(RecommendationService_1.name);
        this.productVectors = new Map();
        this.vocabulary = [];
        this.isModelTrained = false;
        this.lastTrainingTime = null;
        this.isTraining = false;
        this.modelSource = 'none';
        this.tfidf = new natural.TfIdf();
    }
    async onModuleInit() {
        try {
            const loaded = await this.loadModelFromDatabase();
            if (!loaded) {
                await this.trainTfIdfModel();
            }
            this.logger.log(`TF-IDF model loaded from ${this.modelSource} on startup.`);
        }
        catch (error) {
            this.logger.error('Failed to initialize TF-IDF model on startup:', error);
        }
    }
    async scheduledModelUpdate() {
        this.logger.log('Starting scheduled TF-IDF model update...');
        try {
            await this.trainTfIdfModel();
        }
        catch (error) {
            this.logger.error('Scheduled model update failed:', error);
        }
    }
    async loadModelFromDatabase() {
        try {
            this.logger.log('Loading TF-IDF model from database...');
            const savedModel = await this.tfidfModelModel
                .findOne()
                .sort({ trainedAt: -1 })
                .exec();
            if (!savedModel) {
                this.logger.log('No saved model found in database');
                return false;
            }
            const daysDiff = Math.floor((Date.now() - savedModel.trainedAt.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff > 7) {
                this.logger.log(`Saved model is ${daysDiff} days old, retraining...`);
                return false;
            }
            this.vocabulary = savedModel.vocabulary;
            this.productVectors.clear();
            for (const [productId, vector] of Object.entries(savedModel.productVectors)) {
                this.productVectors.set(productId, vector);
            }
            this.isModelTrained = true;
            this.lastTrainingTime = savedModel.trainedAt;
            this.modelSource = 'database';
            this.logger.log(`Model loaded from database. Products: ${this.productVectors.size}, ` +
                `Vocabulary: ${this.vocabulary.length}, Age: ${daysDiff} days`);
            return true;
        }
        catch (error) {
            this.logger.error('Failed to load model from database:', error);
            return false;
        }
    }
    async saveModelToDatabase() {
        try {
            this.logger.log('Saving TF-IDF model to database...');
            const productVectorsRecord = {};
            for (const [productId, vector] of this.productVectors) {
                productVectorsRecord[productId] = vector;
            }
            await this.tfidfModelModel.deleteMany({}).exec();
            await this.tfidfModelModel.create({
                vocabulary: this.vocabulary,
                productVectors: productVectorsRecord,
                trainedAt: new Date(),
            });
            this.logger.log('Model saved to database successfully');
        }
        catch (error) {
            this.logger.error('Failed to save model to database:', error);
            throw error;
        }
    }
    async trainTfIdfModel() {
        if (this.isTraining) {
            this.logger.warn('Model training already in progress, skipping...');
            return;
        }
        this.isTraining = true;
        const startTime = Date.now();
        this.logger.log('Starting TF-IDF model training...');
        try {
            this.tfidf = new natural.TfIdf();
            this.productVectors.clear();
            this.vocabulary = [];
            const products = await this.productModel
                .find({ isActive: { $ne: false } })
                .populate('category', 'name')
                .populate('brand', 'name')
                .populate('variants', 'price')
                .select('name category brand description attributes variants')
                .lean()
                .exec();
            if (products.length === 0) {
                this.logger.warn('No products found for training');
                return;
            }
            const vocabSet = new Set();
            const documentsMap = new Map();
            for (const product of products) {
                const combinedFeatures = this.extractProductFeatures(product);
                documentsMap.set(product._id.toString(), combinedFeatures);
                this.tfidf.addDocument(combinedFeatures);
                const tokens = this.tokenizeText(combinedFeatures);
                tokens.forEach((token) => vocabSet.add(token));
            }
            this.vocabulary = Array.from(vocabSet).sort();
            products.forEach((product, docIndex) => {
                const vector = this.createProductVector(docIndex);
                this.productVectors.set(product._id.toString(), vector);
            });
            this.isModelTrained = true;
            this.lastTrainingTime = new Date();
            this.modelSource = 'memory';
            await this.saveModelToDatabase();
            const duration = Date.now() - startTime;
            this.logger.log(`TF-IDF model training completed. Products: ${products.length}, ` +
                `Vocabulary size: ${this.vocabulary.length}, Duration: ${duration}ms`);
        }
        catch (error) {
            this.logger.error('TF-IDF model training failed:', error);
            throw error;
        }
        finally {
            this.isTraining = false;
        }
    }
    extractProductFeatures(product) {
        const features = [
            product.name || '',
            product.category?.name || '',
            product.brand?.name || '',
            product.description || '',
            product.attributes || '',
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .trim();
        return features;
    }
    tokenizeText(text) {
        if (!text)
            return [];
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((token) => token.length > 2)
            .map((token) => natural.PorterStemmer.stem(token));
    }
    createProductVector(docIndex) {
        const vector = new Array(this.vocabulary.length).fill(0);
        const terms = this.tfidf.listTerms(docIndex);
        for (const termData of terms) {
            const termIndex = this.vocabulary.indexOf(termData.term);
            if (termIndex !== -1) {
                vector[termIndex] = termData.tfidf;
            }
        }
        return vector;
    }
    calculateCosineSimilarity(vec1, vec2) {
        if (!vec1 || !vec2 || vec1.length !== vec2.length) {
            return 0;
        }
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            magnitudeA += vec1[i] ** 2;
            magnitudeB += vec2[i] ** 2;
        }
        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);
        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }
        return dotProduct / (magnitudeA * magnitudeB);
    }
    async getRecommendedProducts(productId, limit = 5, minSimilarity = 0.1) {
        if (!productId) {
            throw new common_1.BadRequestException('Product ID is required');
        }
        if (!this.isModelTrained) {
            this.logger.warn('Model not trained yet, loading from database...');
            const loaded = await this.loadModelFromDatabase();
            if (!loaded) {
                this.logger.warn('No saved model found, training new model...');
                await this.trainTfIdfModel();
            }
        }
        const targetProduct = await this.productModel
            .findById(productId)
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('variants', 'price imagesMain')
            .select('name discount category brand variants description attributes isActive')
            .lean()
            .exec();
        if (!targetProduct || targetProduct.isActive === false) {
            return [];
        }
        let targetVector = this.productVectors.get(productId);
        if (!targetVector) {
            this.logger.warn(`Vector not found for product ${productId}, retraining...`);
            await this.trainTfIdfModel();
            targetVector = this.productVectors.get(productId);
            if (!targetVector) {
                throw new Error(`Could not generate vector for product ${productId}`);
            }
        }
        const similarities = [];
        const batchSize = 100;
        const productEntries = Array.from(this.productVectors.entries());
        for (let i = 0; i < productEntries.length; i += batchSize) {
            const batch = productEntries.slice(i, i + batchSize);
            const batchPromises = batch.map(async ([otherProductId, otherVector]) => {
                if (otherProductId === productId)
                    return null;
                const similarity = this.calculateCosineSimilarity(targetVector, otherVector);
                if (similarity >= minSimilarity) {
                    const product = await this.productModel
                        .findById(otherProductId)
                        .populate('category', 'name')
                        .populate('brand', 'name')
                        .populate('variants', 'price imagesMain')
                        .select('name category brand discount variants description attributes isActive')
                        .lean()
                        .exec();
                    if (product && product.isActive !== false) {
                        return { product, score: similarity };
                    }
                }
                return null;
            });
            const batchResults = await Promise.all(batchPromises);
            similarities.push(...batchResults.filter(Boolean));
        }
        similarities.sort((a, b) => b.score - a.score);
        return similarities.slice(0, limit).map((s) => s.product);
    }
    async getRecommendationsForUser(userId, limit = 10) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const userInteractedProducts = await this.getUserInteractedProducts(userId);
        if (userInteractedProducts.length === 0) {
            return this.getPopularProducts(limit);
        }
        const allRecommendations = new Map();
        const recommendationPromises = userInteractedProducts.map(async (productId) => {
            try {
                const similarProducts = await this.getRecommendedProducts(productId, limit * 2, 0.05);
                return { productId, similarProducts };
            }
            catch (error) {
                this.logger.warn(`Failed to get recommendations for product ${productId}:`, error);
                return { productId, similarProducts: [] };
            }
        });
        const results = await Promise.all(recommendationPromises);
        results.forEach(({ productId, similarProducts }, index) => {
            const weight = Math.pow(0.9, index);
            similarProducts.forEach((product) => {
                const id = product._id.toString();
                if (userInteractedProducts.includes(id))
                    return;
                const existing = allRecommendations.get(id);
                const score = weight;
                if (existing) {
                    existing.totalScore += score;
                }
                else {
                    allRecommendations.set(id, { product, totalScore: score });
                }
            });
        });
        const sortedProducts = Array.from(allRecommendations.values())
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, limit)
            .map((r) => r.product);
        if (sortedProducts.length < limit) {
            const popularProducts = await this.getPopularProducts(limit - sortedProducts.length);
            const existingIds = new Set(sortedProducts.map((p) => p._id.toString()));
            const filteredPopular = popularProducts.filter((p) => !existingIds.has(p._id.toString()));
            sortedProducts.push(...filteredPopular);
        }
        return sortedProducts;
    }
    async getPopularProducts(limit) {
        return this.productModel
            .find({ isActive: { $ne: false } })
            .sort({ viewCount: -1, soldCount: -1 })
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('variants', 'price imagesMain')
            .select('name discount category brand variants description isActive')
            .limit(limit)
            .lean()
            .exec();
    }
    async getUserInteractedProducts(userId) {
        const histories = await this.viewHistoryModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
            .exec();
        return [...new Set(histories.map((h) => h.productId.toString()))];
    }
    async forceRetrainModel() {
        this.logger.log('Force retraining TF-IDF model...');
        await this.trainTfIdfModel();
    }
    async clearSavedModel() {
        this.logger.log('Clearing saved TF-IDF model from database...');
        await this.tfidfModelModel.deleteMany({}).exec();
        this.logger.log('Saved model cleared successfully');
    }
    getModelStatus() {
        return {
            isModelTrained: this.isModelTrained,
            lastTrainingTime: this.lastTrainingTime,
            vocabularySize: this.vocabulary.length,
            productCount: this.productVectors.size,
            modelSource: this.modelSource,
        };
    }
    async recordViewHistory(userId, productId) {
        if (!userId || !productId) {
            throw new common_1.BadRequestException('User ID and Product ID are required');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existing = await this.viewHistoryModel
            .findOne({
            productId,
            userId,
            createdAt: { $gte: today },
        })
            .exec();
        if (!existing) {
            await this.viewHistoryModel.create({ productId, userId });
            await this.productModel
                .findByIdAndUpdate(productId, { $inc: { viewCount: 1 } }, { new: true })
                .exec();
        }
    }
    async getRecommendationsFromViewedProducts(productIds, limit = 5, excludeIds = []) {
        if (!productIds || productIds.length === 0) {
            return this.getPopularProducts(limit);
        }
        const allRecommendations = new Map();
        const recommendationPromises = productIds.map(async (productId, index) => {
            try {
                const similarProducts = await this.getRecommendedProducts(productId, limit * 2, 0.05);
                return { productId, similarProducts, index };
            }
            catch (error) {
                this.logger.warn(`Failed to get recommendations for product ${productId}:`, error);
                return { productId, similarProducts: [], index };
            }
        });
        const results = await Promise.all(recommendationPromises);
        results.forEach(({ productId, similarProducts, index }) => {
            const weight = Math.pow(0.9, index);
            similarProducts.forEach((product) => {
                const id = product._id.toString();
                if (productIds.includes(id) || excludeIds.includes(id))
                    return;
                const existing = allRecommendations.get(id);
                const score = weight;
                if (existing) {
                    existing.totalScore += score;
                }
                else {
                    allRecommendations.set(id, { product, totalScore: score });
                }
            });
        });
        return Array.from(allRecommendations.values())
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, limit)
            .map((r) => r.product);
    }
    async getCategoryBasedRecommendations(categoryId, limit = 10, excludeIds = []) {
        return this.productModel
            .find({
            category: categoryId,
            isActive: { $ne: false },
        })
            .sort({ viewCount: -1, soldCount: -1 })
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('variants', 'price imagesMain')
            .select('name discount category brand variants description isActive')
            .limit(limit)
            .lean()
            .exec();
    }
    async getBrandBasedRecommendations(brandId, limit = 10, excludeIds = []) {
        return this.productModel
            .find({
            brand: brandId,
            isActive: { $ne: false },
            _id: { $nin: excludeIds },
        })
            .sort({ viewCount: -1, soldCount: -1 })
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('variants', 'price imagesMain')
            .limit(limit)
            .lean()
            .exec();
    }
};
exports.RecommendationService = RecommendationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecommendationService.prototype, "scheduledModelUpdate", null);
exports.RecommendationService = RecommendationService = RecommendationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Products.name)),
    __param(1, (0, mongoose_1.InjectModel)(view_histories_schema_1.ViewHistory.name)),
    __param(2, (0, mongoose_1.InjectModel)(tfidf_mode_schema_1.TfidfModel.name)),
    __metadata("design:paramtypes", [Object, Object, mongoose_2.Model])
], RecommendationService);
//# sourceMappingURL=recommendation.service.js.map