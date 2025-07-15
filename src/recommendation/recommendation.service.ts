import {
  Injectable,
  Logger,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

import * as natural from 'natural';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { Products, ProductDocument } from 'src/product/schemas/product.schema';
import {
  ViewHistory,
  ViewHistoryDocument,
} from './schemas/view_histories.schema';
import { create } from 'domain';

interface SimilarityResult {
  product: Products;
  score: number;
}

@Injectable()
export class RecommendationService implements OnModuleInit {
  private readonly logger = new Logger(RecommendationService.name);
  private tfidf: natural.TfIdf;
  private productVectors: Map<string, number[]> = new Map();
  private vocabulary: string[] = [];
  private isModelTrained = false;
  private lastTrainingTime: Date | null = null;

  constructor(
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,

    @InjectModel(ViewHistory.name)
    private readonly viewHistoryModel: SoftDeleteModel<ViewHistoryDocument>,
  ) {
    this.tfidf = new natural.TfIdf();
  }

  async onModuleInit() {
    try {
      await this.trainTfIdfModel();
      this.logger.log('TF-IDF model trained on startup.');
    } catch (error) {
      this.logger.error('Failed to train TF-IDF model on startup:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async scheduledModelUpdate() {
    this.logger.log('Starting scheduled TF-IDF model update...');
    try {
      await this.trainTfIdfModel();
    } catch (error) {
      this.logger.error('Scheduled model update failed:', error);
    }
  }

  async trainTfIdfModel(): Promise<void> {
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
        .select('name category brand description tags')
        .lean();

      if (products.length === 0) {
        this.logger.warn('No products found for training');
        return;
      }

      const vocabSet = new Set<string>();
      const documentsMap = new Map<string, string>();

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

      const duration = Date.now() - startTime;
      this.logger.log(
        `TF-IDF model training completed. Products: ${products.length}, ` +
          `Vocabulary size: ${this.vocabulary.length}, Duration: ${duration}ms`,
      );
    } catch (error) {
      this.logger.error('TF-IDF model training failed:', error);
      throw error;
    }
  }

  private extractProductFeatures(product: any): string {
    const features = [
      product.name || '',
      product.category?.name || '',
      product.brand?.name || '',
      product.description || '',
      ...(product.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .trim();

    return features;
  }

  private tokenizeText(text: string): string[] {
    if (!text) return [];

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2)
      .map((token) => natural.PorterStemmer.stem(token));
  }

  private createProductVector(docIndex: number): number[] {
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
  //Hàm tính độ tương đồng giữa 2 vector
  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
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

  async getRecommendedProducts(
    productId: string,
    limit = 6,
    minSimilarity = 0.1,
  ): Promise<Products[]> {
    if (!this.isModelTrained) {
      this.logger.warn('Model not trained yet, training now...');
      await this.trainTfIdfModel();
    }

    const targetProduct = await this.productModel
      .findById(productId)
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('variants', 'price images')
      .select('name discount category brand variants description ')
      .lean();

    if (!targetProduct) {
      return [];
    }

    let targetVector = this.productVectors.get(productId);
    if (!targetVector) {
      this.logger.warn(
        `Vector not found for product ${productId}, retraining...`,
      );
      await this.trainTfIdfModel();
      targetVector = this.productVectors.get(productId);

      if (!targetVector) {
        throw new Error(`Could not generate vector for product ${productId}`);
      }
    }

    const similarities: SimilarityResult[] = [];

    for (const [otherProductId, otherVector] of this.productVectors) {
      if (otherProductId === productId) continue;

      const similarity = this.calculateCosineSimilarity(
        targetVector,
        otherVector,
      );

      if (similarity >= minSimilarity) {
        const product = await this.productModel
          .findById(otherProductId)
          .populate('category', 'name')
          .populate('brand', 'name')
          .populate('variants', 'price images')
          .select('name category brand variants description tags')
          .lean();

        if (product && product.isActive !== false) {
          similarities.push({ product, score: similarity });
        }
      }
    }

    similarities.sort((a, b) => b.score - a.score);
    return similarities.slice(0, limit).map((s) => s.product);
  }

  async getRecommendationsForUser(
    userId: string,
    limit = 6,
  ): Promise<Products[]> {
    const userInteractedProducts = await this.getUserInteractedProducts(userId);

    if (userInteractedProducts.length === 0) {
      return this.getPopularProducts(limit);
    }

    const allRecommendations = new Map<
      string,
      { product: Products; totalScore: number }
    >();

    for (const productId of userInteractedProducts) {
      try {
        const similarProducts = await this.getRecommendedProducts(
          productId,
          limit * 5,
        );

        similarProducts.forEach((product) => {
          const id = (product as any)._id.toString();
          if (userInteractedProducts.includes(id)) return;

          const existing = allRecommendations.get(id);
          const score = 1;

          if (existing) {
            existing.totalScore += score;
          } else {
            allRecommendations.set(id, { product, totalScore: score });
          }
        });
      } catch (error) {
        this.logger.warn(
          `Failed to get recommendations for product ${productId}:`,
          error,
        );
      }
    }

    const sortedProducts = Array.from(allRecommendations.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map((r) => r.product);
    const fullProducts = await this.productModel
      .find({ _id: { $in: sortedProducts } })
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('variants', 'price images')
      .select('name category brand variants description tags')
      .lean();

    return fullProducts;
  }

  async getPopularProducts(limit: number): Promise<Products[]> {
    return this.productModel
      .find({ isActive: { $ne: false } })
      .sort({ viewCount: -1, soldCount: -1 })
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('variants', 'price images')
      .limit(limit)
      .lean();
  }

  private async getUserInteractedProducts(userId: string): Promise<string[]> {
    const histories = await this.viewHistoryModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('productId')
      .lean();

    return [...new Set(histories.map((h) => h.productId.toString()))];
  }

  async forceRetrainModel(): Promise<void> {
    this.logger.log('Force retraining TF-IDF model...');
    await this.trainTfIdfModel();
  }

  getModelStatus() {
    return {
      isModelTrained: this.isModelTrained,
      lastTrainingTime: this.lastTrainingTime,
      vocabularySize: this.vocabulary.length,
      productCount: this.productVectors.size,
    };
  }

  async recordViewHistory(userId: string, productId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.viewHistoryModel.findOne({
      productId,
      userId,
      createdAt: { $gte: today },
    });

    if (!existing) {
      await this.viewHistoryModel.create({ productId, userId });
    }
  }

  // async getRecommendationsFromViewedProducts(
  //   productIds: string[],
  //   limit = 10,
  // ): Promise<Products[]> {
  //   const allRecommendations = new Map<
  //     string,
  //     { product: Products; totalScore: number }
  //   >();

  //   for (const productId of productIds) {
  //     try {
  //       const similarProducts = await this.getRecommendedProducts(
  //         productId,
  //         limit * 2,
  //       );

  //       similarProducts.forEach((product) => {
  //         const id = (product as any)._id.toString();
  //         if (productIds.includes(id)) return;

  //         const existing = allRecommendations.get(id);
  //         const score = 1;

  //         if (existing) {
  //           existing.totalScore += score;
  //         } else {
  //           allRecommendations.set(id, { product, totalScore: score });
  //         }
  //       });
  //     } catch (error) {
  //       this.logger.warn(
  //         `Failed to get recommendations for product ${productId}:`,
  //         error,
  //       );
  //     }
  //   }

  //   return Array.from(allRecommendations.values())
  //     .sort((a, b) => b.totalScore - a.totalScore)
  //     .slice(0, limit)
  //     .map((r) => r.product);
  // }
}
