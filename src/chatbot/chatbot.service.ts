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
  name: string;
  description: string;
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
  Vai trò: Bạn là trợ lý AI chuyên nghiệp của công ty ABC, chuyên tư vấn sản phẩm.
  Nguyên tắc trả lời:
  1. LUÔN dựa vào thông tin được cung cấp trong context
  2. Trả lời ngắn gọn, súc tích, thân thiện
  3. Nếu không có thông tin: "Tôi không có thông tin về vấn đề này"
  4. Không bịa đặt thông tin không có trong context
  5. Khi đề xuất sản phẩm, ưu tiên theo độ liên quan
  6. Luôn giữ tên sản phẩm và thương hiệu chính xác
  7. Nếu dữ liệu có sai thì không cần thông báo
  8. Hỗ trợ so sánh sản phẩm khi có nhiều lựa chọn
  
  Định dạng hiển thị hình ảnh:
  <div style="text-align: center; margin: 12px 0;">
    <img src="IMAGE_URL" alt="Hình sản phẩm" style="max-width: 100%; width: 280px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
  </div>
    `.trim();

  async onModuleInit() {
    try {
      console;
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
              text: 'Tôi đã hiểu vai trò. Sẵn sàng hỗ trợ khách hàng về sản phẩm ABC.',
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
      .populate({ path: 'variants', select: 'images price color memory' });

    if (!products?.length) {
      this.logger.warn('Không tìm thấy sản phẩm nào.');
      return;
    }

    this.logger.log(`Tạo embedding cho ${products.length} sản phẩm...`);

    const BATCH_SIZE = 10;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (product) => {
          const description = this.formatProductInfo(product);
          const imageHtml = product.variants[0]?.images || '';
          const vector = await this.getEmbedding(description);

          this.productData.push({
            name: product.name,
            description: `${description}\n${imageHtml}`,
            vector,
          });
        }),
      );
    }

    this.logger.log(
      `Đã tạo embedding cho ${this.productData.length} sản phẩm.`,
    );
  }

  private formatProductInfo(product: any): string {
    const category = this.getNameFromPopulatedField(product.category);
    const brand = this.getNameFromPopulatedField(product.brand);
    const imageUrl = product?.variants[0]?.images;
    const variants =
      product.variants
        ?.map(
          (v: any, i: number) =>
            `Biến thể ${i + 1}: Giá: ${v.price || 'Liên hệ'} VNĐ` +
            (v.color?.colorName ? `, Màu: ${v.color.colorName}` : '') +
            (v.memory?.ram || v.memory?.storage
              ? `, RAM: ${v.memory?.ram || 'Chưa rõ'}, Bộ nhớ: ${v.memory?.storage || 'Chưa rõ'}`
              : ''),
        )
        .join('\n') || 'Không có biến thể';

    return `Tên sản phẩm: ${product.name}\nDanh mục: ${category}\nThương hiệu: ${brand}\n${variants}\nHình ảnh: ${imageUrl}\nTrạng thái: ${product.isActive ? 'Còn bán' : 'Ngừng bán'}`;
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
      const topProducts = this.findRelevantProducts(inputVector, 3);

      if (!topProducts.length) return 'Không tìm thấy sản phẩm phù hợp.';

      const context = topProducts
        .map((p, i) => `Sản phẩm #${i + 1}:\n${p.description}`)
        .join('\n\n');

      const prompt = `Yêu cầu: ${this.SYSTEM_PROMPT}\nCâu hỏi: ${userInput}\nDữ liệu liên quan:\n${context}\nVui lòng trả lời dựa vào thông tin trên.`;

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
    topK = 3,
  ): ProductWithEmbedding[] {
    if (!this.productData.length) return [];

    return this.productData
      .map((p) => ({
        ...p,
        score: this.calculateCosineSimilarity(p.vector, inputVector),
      }))
      .filter((p) => (p.score || 0) > 0.5)
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
}
