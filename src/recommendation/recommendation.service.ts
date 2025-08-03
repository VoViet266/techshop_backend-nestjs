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
import {
  TfidfModel,
  TfidfModelDocument,
} from 'src/tfidf-mode/schemas/tfidf-mode.schema';

interface SimilarityResult {
  product: Products;
  score: number;
}

interface ModelStatus {
  isModelTrained: boolean;
  lastTrainingTime: Date | null;
  vocabularySize: number;
  productCount: number;
  modelSource: 'database' | 'memory' | 'none';
}

@Injectable()
export class RecommendationService implements OnModuleInit {
  private readonly logger = new Logger(RecommendationService.name);
  private tfidf: natural.TfIdf;
  private productVectors: Map<string, number[]> = new Map();
  private vocabulary: string[] = [];
  private isModelTrained = false;
  private lastTrainingTime: Date | null = null;
  private isTraining = false;
  private modelSource: 'database' | 'memory' | 'none' = 'none';

  constructor(
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,

    @InjectModel(ViewHistory.name)
    private readonly viewHistoryModel: SoftDeleteModel<ViewHistoryDocument>,

    @InjectModel(TfidfModel.name)
    private readonly tfidfModelModel: Model<TfidfModelDocument>,
  ) {
    this.tfidf = new natural.TfIdf();
  }

  async onModuleInit() {
    try {
      // Thử load model từ database trước
      const loaded = await this.loadModelFromDatabase();
      if (!loaded) {
        // Nếu không có model trong DB, train mới
        await this.trainTfIdfModel();
      }
      this.logger.log(
        `TF-IDF model loaded from ${this.modelSource} on startup.`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize TF-IDF model on startup:', error);
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

  async loadModelFromDatabase(): Promise<boolean> {
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
      const daysDiff = Math.floor(
        (Date.now() - savedModel.trainedAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff > 7) {
        this.logger.log(`Saved model is ${daysDiff} days old, retraining...`);
        return false;
      }

      this.vocabulary = savedModel.vocabulary;
      this.productVectors.clear();

      // Convert Record<string, number[]> back to Map
      for (const [productId, vector] of Object.entries(
        savedModel.productVectors,
      )) {
        this.productVectors.set(productId, vector);
      }

      this.isModelTrained = true;
      this.lastTrainingTime = savedModel.trainedAt;
      this.modelSource = 'database';

      this.logger.log(
        `Model loaded from database. Products: ${this.productVectors.size}, ` +
          `Vocabulary: ${this.vocabulary.length}, Age: ${daysDiff} days`,
      );

      return true;
    } catch (error) {
      this.logger.error('Failed to load model from database:', error);
      return false;
    }
  }

  async saveModelToDatabase(): Promise<void> {
    try {
      this.logger.log('Saving TF-IDF model to database...');

      const productVectorsRecord: Record<string, number[]> = {};
      for (const [productId, vector] of this.productVectors) {
        productVectorsRecord[productId] = vector;
      }

      // Xóa model cũ và lưu model mới
      await this.tfidfModelModel.deleteMany({}).exec();

      await this.tfidfModelModel.create({
        vocabulary: this.vocabulary,
        productVectors: productVectorsRecord,
        trainedAt: new Date(),
      });

      this.logger.log('Model saved to database successfully');
    } catch (error) {
      this.logger.error('Failed to save model to database:', error);
      throw error;
    }
  }

  async trainTfIdfModel(): Promise<void> {
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

      const vocabSet = new Set<string>();
      const documentsMap = new Map<string, string>();

      for (const product of products) {
        const combinedFeatures = this.extractProductFeatures(product);
        documentsMap.set(product._id.toString(), combinedFeatures);
        this.tfidf.addDocument(combinedFeatures);

        const tokens = this.tokenizeText(combinedFeatures);
        tokens.forEach((token) => vocabSet.add(token));
      }
      // Create vocabulary từ set
      this.vocabulary = Array.from(vocabSet).sort();

      // Create vectors for all products
      products.forEach((product, docIndex) => {
        const vector = this.createProductVector(docIndex);
        this.productVectors.set(product._id.toString(), vector);
      });

      this.isModelTrained = true;
      this.lastTrainingTime = new Date();
      this.modelSource = 'memory';

      // Save model to database
      await this.saveModelToDatabase();

      const duration = Date.now() - startTime;
      this.logger.log(
        `TF-IDF model training completed. Products: ${products.length}, ` +
          `Vocabulary size: ${this.vocabulary.length}, Duration: ${duration}ms`,
      );
    } catch (error) {
      this.logger.error('TF-IDF model training failed:', error);
      throw error;
    } finally {
      this.isTraining = false;
    }
  }
  // Triển khai hàm tạo vector cho mô tả
  private extractProductFeatures(product: any): string {
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
  // Tokenize text
  private tokenizeText(text: string): string[] {
    if (!text) return [];

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2)
      .map((token) => natural.PorterStemmer.stem(token));
  }
  // Tạo vector cho một sản phẩm
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

  // Tính độ tương đồng giữa hai vector
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
    limit = 5,
    minSimilarity = 0.1,
  ): Promise<Products[]> {
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    // Kiểm tra và load model nếu cần
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
      .populate('variants', 'price color')
      .select(
        'name discount category brand variants description attributes isActive',
      )
      .lean()
      .exec();

    if (!targetProduct || targetProduct.isActive === false) {
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

    // Calculate similarities in batches
    const batchSize = 100;
    const productEntries = Array.from(this.productVectors.entries());

    for (let i = 0; i < productEntries.length; i += batchSize) {
      const batch = productEntries.slice(i, i + batchSize);

      const batchPromises = batch.map(async ([otherProductId, otherVector]) => {
        if (otherProductId === productId) return null;

        const similarity = this.calculateCosineSimilarity(
          targetVector,
          otherVector,
        );

        if (similarity >= minSimilarity) {
          /// Lay thong tin san pham
          const product = await this.productModel
            .findById(otherProductId)
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('variants', 'price color memory ')
            .select(
              'name category brand discount variants description attributes isActive',
            )
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

  async getRecommendationsForUser(
    userId: string,
    limit = 10,
  ): Promise<Products[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const userInteractedProducts = await this.getUserInteractedProducts(userId);

    if (userInteractedProducts.length === 0) {
      return this.getPopularProducts(limit);
    }

    const allRecommendations = new Map<
      string,
      { product: Products; totalScore: number }
    >();

    const recommendationPromises = userInteractedProducts.map(
      async (productId) => {
        try {
          const similarProducts = await this.getRecommendedProducts(
            productId,
            limit * 2,
            0.05,
          );

          return { productId, similarProducts };
        } catch (error) {
          this.logger.warn(
            `Failed to get recommendations for product ${productId}:`,
            error,
          );
          return { productId, similarProducts: [] };
        }
      },
    );

    const results = await Promise.all(recommendationPromises);

    results.forEach(({ productId, similarProducts }, index) => {
      const weight = Math.pow(0.9, index);

      similarProducts.forEach((product) => {
        const id = (product as any)._id.toString();
        if (userInteractedProducts.includes(id)) return;

        const existing = allRecommendations.get(id);
        const score = weight;

        if (existing) {
          existing.totalScore += score;
        } else {
          allRecommendations.set(id, { product, totalScore: score });
        }
      });
    });

    const sortedProducts = Array.from(allRecommendations.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map((r) => r.product);

    if (sortedProducts.length < limit) {
      const popularProducts = await this.getPopularProducts(
        limit - sortedProducts.length,
      );
      const existingIds = new Set(
        sortedProducts.map((p) => (p as any)._id.toString()),
      );

      const filteredPopular = popularProducts.filter(
        (p) => !existingIds.has((p as any)._id.toString()),
      );

      sortedProducts.push(...filteredPopular);
    }

    return sortedProducts;
  }

  async getPopularProducts(limit: number): Promise<Products[]> {
    return this.productModel
      .find({ isActive: { $ne: false } })
      .sort({ viewCount: -1, soldCount: -1 })
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('variants', 'price color')
      .select('name discount category brand variants description isActive')
      .limit(limit)
      .lean()
      .exec();
  }

  private async getUserInteractedProducts(userId: string): Promise<string[]> {
    const histories = await this.viewHistoryModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      // .select('productId ')
      .lean()
      .exec();

    return [...new Set(histories.map((h) => h.productId.toString()))];
  }

  async forceRetrainModel(): Promise<void> {
    this.logger.log('Force retraining TF-IDF model...');
    await this.trainTfIdfModel();
  }

  async clearSavedModel(): Promise<void> {
    this.logger.log('Clearing saved TF-IDF model from database...');
    await this.tfidfModelModel.deleteMany({}).exec();
    this.logger.log('Saved model cleared successfully');
  }

  getModelStatus(): ModelStatus {
    return {
      isModelTrained: this.isModelTrained,
      lastTrainingTime: this.lastTrainingTime,
      vocabularySize: this.vocabulary.length,
      productCount: this.productVectors.size,
      modelSource: this.modelSource,
    };
  }

  async recordViewHistory(userId: string, productId: string): Promise<void> {
    if (!userId || !productId) {
      throw new BadRequestException('User ID and Product ID are required');
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

  async getRecommendationsFromViewedProducts(
    productIds: string[],
    limit = 5,
    excludeIds: string[] = [],
  ): Promise<Products[]> {
    // Nếu người dùng chưa xem sản phẩm nào thì trả về danh sách sản phẩm phổ biến
    if (!productIds || productIds.length === 0) {
      return this.getPopularProducts(limit);
    }

    // Khởi tạo Map để lưu trữ sản phẩm gợi ý

    // totalScore dùng để xếp hạng độ ưu tiên sản phẩm
    const allRecommendations = new Map<
      string,
      { product: Products; totalScore: number }
    >();

    //Tạo danh sách promise để gọi hàm lấy sản phẩm tương tự cho từng sản phẩm đã xem
    const recommendationPromises = productIds.map(async (productId, index) => {
      try {
        // Gọi hàm lấy sản phẩm tương tự
        // Lấy nhiều hơn limit (limit * 2) để có thêm lựa chọn
        // Tham số 0.05 là ngưỡng độ tương đồng
        const similarProducts = await this.getRecommendedProducts(
          productId,
          limit * 2,
          0.05,
        );

        // Trả về kết quả (productId, danh sách sản phẩm tương tự và index)
        return { productId, similarProducts, index };
      } catch (error) {
        // Nếu lỗi (vd: không lấy được gợi ý cho sản phẩm này), log cảnh báo
        this.logger.warn(
          `Failed to get recommendations for product ${productId}:`,
          error,
        );
        // Trả về danh sách rỗng để không làm hỏng luồng xử lý
        return { productId, similarProducts: [], index };
      }
    });

    const results = await Promise.all(recommendationPromises);

    // Duyệt qua từng kết quả để tính điểm gợi ý cho các sản phẩm tương tự
    results.forEach(({ productId, similarProducts, index }) => {
      // Gán trọng số giảm dần theo thứ tự sản phẩm mà user đã xem
      // Sản phẩm xem trước quan trọng hơn (index càng lớn → weight càng nhỏ)
      const weight = Math.pow(0.9, index);

      similarProducts.forEach((product) => {
        const id = (product as any)._id.toString();

        // Bỏ qua nếu:
        // - Sản phẩm đang gợi ý chính là sản phẩm user đã xem (productIds)
        // - Sản phẩm nằm trong danh sách cần loại bỏ (excludeIds)
        if (productIds.includes(id) || excludeIds.includes(id)) return;

        // Kiểm tra sản phẩm đã có trong Map chưa
        const existing = allRecommendations.get(id);
        const score = weight;

        if (existing) {
          // Nếu đã tồn tại thì cộng dồn điểm
          existing.totalScore += score;
        } else {
          // Nếu chưa có thêm mới với điểm khởi tạo
          allRecommendations.set(id, { product, totalScore: score });
        }
      });
    });

    //Chuyển Map → mảng, sắp xếp theo totalScore giảm dần, giới hạn số lượng, và trả về product
    return Array.from(allRecommendations.values())
      .sort((a, b) => b.totalScore - a.totalScore) // xếp sản phẩm có điểm cao hơn lên đầu
      .slice(0, limit) // chỉ lấy số lượng theo limit
      .map((r) => r.product); // chỉ lấy thông tin sản phẩm (bỏ điểm số)
  }

  async getCategoryBasedRecommendations(
    categoryId: string,
    limit = 10,
    excludeIds: string[] = [],
  ): Promise<Products[]> {
    return this.productModel
      .find({
        category: categoryId,
        isActive: { $ne: false },
        // _id: { $nin: excludeIds },
      })
      .sort({ viewCount: -1, soldCount: -1 })
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('variants', 'price color')
      .select('name discount category brand variants description isActive')
      .limit(limit)
      .lean()
      .exec();
  }

  async getBrandBasedRecommendations(
    brandId: string,
    limit = 10,
    excludeIds: string[] = [],
  ): Promise<Products[]> {
    return this.productModel
      .find({
        brand: brandId,
        isActive: { $ne: false },
        _id: { $nin: excludeIds },
      })
      .sort({ viewCount: -1, soldCount: -1 })
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('variants', 'price color')
      .limit(limit)
      .lean()
      .exec();
  }
}
