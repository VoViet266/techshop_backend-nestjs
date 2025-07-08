import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from '@google/generative-ai';

import { Products, ProductDocument } from 'src/product/schemas/product.schema';

interface ProductWithEmbedding {
  productId: string;
  productName: string;
  description: string;
  price: number;
  images: string;
  category: string;
  brand: string;
  isActive: boolean;
  vector: number[];
  score?: number;
}

@Injectable()
export class ChatBotService implements OnModuleInit {
  private readonly logger = new Logger(ChatBotService.name);
  private genAI: GoogleGenerativeAI;
  private chatSession: ChatSession;
  private productData: ProductWithEmbedding[] = [];

  @InjectModel(Products.name)
  private readonly ProductModel: SoftDeleteModel<ProductDocument>;

  constructor(private readonly configService: ConfigService) {}

  private readonly SYSTEM_PROMPT = `
  Vai trò của bạn: Là một trợ lý AI chuyên nghiệp của công ty ABC, chỉ tư vấn sản phẩm dựa trên dữ liệu context cung cấp. Câu trả lời được hiển thị gọn gàng.
  
  Nguyên tắc:
      1. Chỉ sử dụng thông tin từ context.  
      2. Trả lời ngắn gọn, súc tích, thân thiện.  
      3. Nếu không có thông tin: trả lời "Tôi không có thông tin về vấn đề này".  
      4. Không suy diễn, không tổng hợp ngoài context.  
      5. Hiển thị thông tin sản phẩm kèm hình ảnh (nếu có).  
      6. Không thêm nội dung giới thiệu lại sản phẩm nếu không được yêu cầu.  
      7. Nếu người dùng hỏi câu hỏi có thể trả lời theo nhiều cách hãy hỏi lại.
      8. Khi được hỏi về nhãn hiệu hoặc danh mục, chỉ sử dụng thông tin từ dữ liệu lớn của bạn để cung cấp thông tin.
      9. Dựa theo template tôi đã cung cấp thì hãy tự style lại nếu cần.
    `.trim();

  async onModuleInit() {
    try {
      await this.initializeGemini();
      await this.loadProductData();
      this.logger.log('ChatBotService initialized successfully');
    } catch (error) {
      this.logger.error(`Initialization failed: ${error.message}`, error.stack);
    }
  }

  private async initializeGemini() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing');

    this.genAI = new GoogleGenerativeAI(apiKey);

    const model = this.genAI.getGenerativeModel({
      model: 'models/gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    this.chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: this.SYSTEM_PROMPT }] },
        {
          role: 'model',
          parts: [
            {
              text: 'Tôi đã hiểu vai trò. Sẵn sàng hỗ trợ khách hàng về sản phẩm ABC một cách chi tiết.',
            },
          ],
        },
      ],
    });
  }

  private async loadProductData() {
    const products = await this.ProductModel.find()
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'brand', select: 'name' })
      .populate({ path: 'variants', select: 'price images' });

    if (!products?.length) {
      this.logger.warn('Không tìm thấy sản phẩm nào.');
      return;
    }

    this.logger.log(`Tạo embedding cho ${products.length} sản phẩm...`);

    const BATCH_SIZE = 10;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      const productPromises = batch.map(async (product) => {
        const category = this.getNameFromPopulatedField(product.category);
        const brand = this.getNameFromPopulatedField(product.brand);

        const productInfo = this.formatProductInfo(product, category, brand);
        const vector = await this.getEmbedding(productInfo.searchText);
        this.productData.push({
          productId: product._id.toString(),
          productName: product.name,
          description: productInfo.fullDescription,
          price: product.variants[0]?.price,
          images: product.variants[0]?.images[0],
          category,
          brand,
          isActive: product.isActive,
          vector,
        });
      });

      await Promise.all(productPromises);
    }

    this.logger.log(
      `Đã tạo embedding cho ${this.productData.length} sản phẩm.`,
    );
  }

  private formatProductInfo(
    product: any,
    category: string,
    brand: string,
  ): {
    searchText: string;
    fullDescription: string;
  } {
    const baseInfo = product.name;
    const categoryInfo = `Danh mục: ${category}`;
    const brandInfo = `Thương hiệu: ${brand}`;
    const statusInfo = `Trạng thái: ${product.isActive ? 'Còn bán' : 'Ngừng bán'}`;

    // Tính toán giá từ variants
    const prices =
      product.variants?.map((variant: any) => variant?.price) || [];
    const minPrice = Math.min(...prices);

    const searchText = [
      baseInfo,
      categoryInfo,
      brandInfo,
      minPrice > 0
        ? `Giá: ${minPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`
        : '',
      statusInfo,
      product.description?.replace(/<[^>]*>/g, '') || '',
    ]
      .filter(Boolean)
      .join(' ');

    const statusColor = product.isActive ? '#4CAF50' : '#f44336';

    const firstImage = product.variants?.find(
      (variant: any) => variant.images?.length > 0,
    )?.images?.[0];

    const fullDescription = `
${
  firstImage
    ? `
<div style="display: flex; align-items: center; border: 1px solid #e0e0e0; border-radius: 12px; padding: 16px; margin: 8px 0; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <div style="flex-shrink: 0; margin-right: 16px;">
    <img src="${firstImage}" alt="${product.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;" />
  </div>
  <div style="flex-grow: 1;">
    <h3 style="margin: 0 0 8px 0; color: #333; font-size: 15px; font-weight: 600;">${product.name}</h3>
    <div style="color: #666; font-size: 14px; line-height: 1.5;">
      <div style="margin-bottom: 4px;"><strong>Giá:</strong> ${minPrice}</div>
      <div style="margin-bottom: 4px;"><strong>Thương hiệu:</strong> ${brand}</div>
      <div style="margin-bottom: 4px;"><strong>Danh mục:</strong> ${category}</div>
      <div style="margin-bottom: 4px;"><strong>Trạng thái:</strong> <span style="color: ${statusColor};">${product.isActive ? 'Còn bán' : 'Ngừng bán'}</span></div>
    </div>
  </div>
</div>
`
    : `
<div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 16px; margin: 12px 0; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px; font-weight: 600;">${product.name}</h3>
  <div style="color: #666; font-size: 14px; line-height: 1.5;">
    <div style="margin-bottom: 4px;"><strong>Giá:</strong> ${minPrice}</div>
    <div style="margin-bottom: 4px;"><strong>Thương hiệu:</strong> ${brand}</div>
    <div style="margin-bottom: 4px;"><strong>Danh mục:</strong> ${category}</div>
    <div><strong>Trạng thái:</strong> <span style="color: ${statusColor};">${product.isActive ? 'Còn bán' : 'Ngừng bán'}</span></div>
  </div>
</div>
`
}

    `.trim();

    return { searchText, fullDescription };
  }

  private getNameFromPopulatedField(field: any): string {
    return Array.isArray(field)
      ? field.map((f) => f?.name || 'Không rõ').join(', ')
      : field?.name || 'Không rõ';
  }

  async sendMessage(userInput: string): Promise<string> {
    if (!userInput?.trim()) return 'Vui lòng nhập câu hỏi.';

    try {
      const inputVector = await this.getEmbedding(userInput);
      const topProducts = this.findRelevantProducts(inputVector, 5);

      if (!topProducts.length) return 'Không tìm thấy sản phẩm phù hợp.';

      const context = topProducts
        .map((product, i) =>
          `
Sản phẩm #${i + 1}:
${product.description}
---
        `.trim(),
        )
        .join('\n\n');

      const prompt = `
Câu hỏi của khách hàng: "${userInput}"

Dữ liệu sản phẩm liên quan:
${context}

Hãy trả lời dựa vào thông tin sản phẩm trên. Nếu có nhiều sản phẩm phù hợp, hãy so sánh và đưa ra lời khuyên. Luôn hiển thị hình ảnh của sản phẩm được đề cập.
      `.trim();

      const result = await this.chatSession.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error(`Lỗi xử lý: ${error.message}`, error.stack);
      return 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.';
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'embedding-001' });
      const result = await model.embedContent({
        content: { parts: [{ text }], role: 'user' },
      });
      const vector = result.embedding?.values;
      if (!Array.isArray(vector)) throw new Error('Không tạo được vector.');
      return vector;
    } catch (error) {
      this.logger.error(`Lỗi embedding: ${error.message}`);
      throw error;
    }
  }

  private findRelevantProducts(
    inputVector: number[],
    topK = 5,
  ): ProductWithEmbedding[] {
    if (!this.productData.length) return [];

    return this.productData
      .map((product) => ({
        ...product,
        score: this.calculateCosineSimilarity(product.vector, inputVector),
      }))
      .filter((product) => (product.score || 0) > 0.3)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, topK);
  }

  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) throw new Error('Vector không cùng chiều.');
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return normA && normB ? dot / (normA * normB) : 0;
  }

  // Utility methods cho sản phẩm
  getProductById(productId: string): ProductWithEmbedding | undefined {
    return this.productData.find((product) => product.productId === productId);
  }

  findProductsByCategory(categoryName: string): ProductWithEmbedding[] {
    return this.productData.filter((product) =>
      product.category.toLowerCase().includes(categoryName.toLowerCase()),
    );
  }

  findProductsByBrand(brandName: string): ProductWithEmbedding[] {
    return this.productData.filter((product) =>
      product.brand.toLowerCase().includes(brandName.toLowerCase()),
    );
  }

  // findProductsByPriceRange(
  //   minPrice: number,
  //   maxPrice: number,
  // ): ProductWithEmbedding[] {
  //   return this.productData.filter(
  //     (product) =>
  //       product.price.min <= maxPrice && product.price.max >= minPrice,
  //   );
  // }

  getAllActiveProducts(): ProductWithEmbedding[] {
    return this.productData.filter((product) => product.isActive);
  }
}
