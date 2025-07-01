import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

import * as natural from 'natural';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductDocument, Products } from 'src/product/schemas/product.schema';



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
  private isModelTrained: boolean = false;
  private lastTrainingTime: Date | null = null;

  constructor(
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
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
        .select(' name category brand ')
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

      this.vocabulary = Array.from(vocabSet).sort(); // Sort để đảm bảo consistency

      products.forEach((product, docIndex) => {
        const vector = this.createProductVector(docIndex);
        this.productVectors.set(product._id.toString(), vector);
       
      });

      this.isModelTrained = true;
      this.lastTrainingTime = new Date();

      const duration = Date.now() - startTime;
      this.logger.log(
        `TF-IDF model training completed. ` +
          `Products: ${products.length}, ` +
          `Vocabulary size: ${this.vocabulary.length}, ` +
          `Duration: ${duration}ms`,
      );
    } catch (error) {
      this.logger.error('TF-IDF model training failed:', error);
      throw error;
    }
  }

  private extractProductFeatures(product: any): string {
    const features = [
      product.name || '',
      product.category.name || '',
      product.brand.name || '',
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
      .replace(/[^\w\s]/g, ' ') // Loại bỏ ký tự đặc biệt
      .split(/\s+/)
      .filter((token) => token.length > 2) // Loại bỏ từ quá ngắn
      .map((token) => natural.PorterStemmer.stem(token)); // Stemming
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

  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (!vec1 || !vec2 || vec1.length !== vec2.length) {
      return 0;
    }
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      magnitudeA += vec1[i] * vec1[i];
      magnitudeB += vec2[i] * vec2[i];
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
    limit: number = 5,
    minSimilarity: number = 0.1,
  ): Promise<Products[]> {
    if (!this.isModelTrained) {
      this.logger.warn('Model not trained yet, training now...');
      await this.trainTfIdfModel();
    }

    const targetProduct = await this.productModel
      .findById(productId)
      .populate('category', 'name')
      .populate('brand', 'name')
      .select('name category brand')
      .lean();

    if (!targetProduct) {
      throw new Error(`Product with ID ${productId} not found`);
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
      if (otherProductId === productId) {
        continue;
      }

      const similarity = this.calculateCosineSimilarity(
        targetVector,
        otherVector,
      );

      if (similarity >= minSimilarity) {
        const product = await this.productModel
          .findById(otherProductId)
          .populate('category', 'name')
          .populate('brand', 'name')
          .select(' name category brand ')
          .lean();

        if (product && product.isActive !== false) {
          similarities.push({
            product: product as Products,
            score: similarity,
          });
        }
      }
    }

    // Sort và lấy top results
    similarities.sort((a, b) => b.score - a.score);
    const results = similarities.slice(0, limit).map((s) => s.product);

    this.logger.debug(
      `Found ${similarities.length} similar products for ${productId}, returning top ${results.length}`,
    );

    return results;
  }

  // async getRecommendationsForUser(
  //   userId: string,
  //   limit: number = 10,
  // ): Promise<Products[]> {
  //   const userInteractedProducts = await this.getUserInteractedProducts(userId);

  //   if (userInteractedProducts.length === 0) {
  //     // Fallback: recommend popular products
  //     return this.getPopularProducts(limit);
  //   }

  //   // Lấy recommendations dựa trên từng sản phẩm user đã tương tác
  //   const allRecommendations = new Map<
  //     string,
  //     { product: Products; totalScore: number }
  //   >();

  //   for (const productId of userInteractedProducts) {
  //     try {
  //       const similarProducts = await this.getRecommendedProducts(
  //         productId,
  //         limit * 2,
  //       );

  //       similarProducts.forEach((product) => {
  //         const id = (product as any)._id.toString();
  //         if (userInteractedProducts.includes(id)) {
  //           return; // Skip products user already interacted with
  //         }

  //         const existing = allRecommendations.get(id);
  //         const score = 1; // Có thể tính score phức tạp hơn

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

  //   // Sort by total score and return top results
  //   const recommendations = Array.from(allRecommendations.values())
  //     .sort((a, b) => b.totalScore - a.totalScore)
  //     .slice(0, limit)
  //     .map((r) => r.product);

  //   return recommendations;
  // }

  // private async getPopularProducts(limit: number): Promise<Products[]> {
  //   return this.productModel
  //     .find({ isActive: { $ne: false } })
  //     .sort({ viewCount: -1, soldCount: -1 }) // Sắp xếp theo lượt xem/bán
  //     .limit(limit)
  //     .lean();
  // }

  // private async getUserInteractedProducts(userId: string): Promise<string[]> {
  //   // Placeholder - implement logic để lấy:
  //   // - Sản phẩm đã mua
  //   // - Sản phẩm đã xem
  //   // - Sản phẩm đã thêm vào wishlist
  //   // - etc.

  //   return [];
  // }

  async forceRetrainModel() {
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
}
