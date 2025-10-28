import {
  Injectable,
  Logger,
  OnModuleInit,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import axios, { AxiosError } from 'axios';

// Định nghĩa kiểu dữ liệu cho phản hồi từ Rasa để code an toàn hơn
interface RasaResponse {
  recipient_id: string;
  text?: string;
  custom?: any;
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from '@google/generative-ai';

import { Products, ProductDocument } from 'src/product/schemas/product.schema';
import { Variant, VariantDocument } from 'src/product/schemas/variant.schema';
import { Brand } from 'src/brand/schemas/brand.schema';
import { Category } from 'src/category/schemas/category.schema';
import { Cron } from '@nestjs/schedule';

interface ProductWithEmbedding {
  productId: string;
  productName: string;
  description: string;
  category: string;
  brand: string;
  variants: {
    variantId: string;
    name: string;
    price: number;
    colors: {
      colorName: string;
      colorHex: string;
      images: string[];
    }[];
    memory?: {
      ram: string;
      storage: string;
    };
    weight: number;
    isActive: boolean;
  }[];
  attributes: Record<string, any>;
  galleryImages: string[];
  discount: number;
  viewCount: number;
  soldCount: number;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  vector: number[];
  score?: number;
}

export const SYSTEM_PROMPT = `
Vai trò của bạn: Là một trợ lý AI chuyên nghiệp của hệ thống thương mại điện tử kinh doanh sản phẩm công nghệ TechShop, chỉ tư vấn sản phẩm dựa trên dữ liệu được cung cấp. Câu trả lời được hiển thị gọn gàng.

Nguyên tắc:
    1. Chỉ sử dụng thông tin từ dữ liệu được cung cấp.
    2. Trả lời ngắn gọn, súc tích, thân thiện.
    3. Nếu không có thông tin: trả lời "Tôi không có thông tin về vấn đề này".
    4. Không suy diễn, không tổng hợp ngoài dữ liệu được cung cấp.
    5. Hiển thị thông tin sản phẩm kèm hình ảnh (nếu có).
    6. Không thêm nội dung giới thiệu lại sản phẩm nếu không được yêu cầu.
    7. Khi được hỏi về nhãn hiệu hoặc danh mục, chỉ sử dụng thông tin từ dữ liệu lớn của bạn để cung cấp thông tin.
    9. Luôn sử dụng ngôn ngữ tiếng Việt trong câu trả lời.
    10. Phần tôi cung cấp cho bạn sẽ có dạng như sau:
        Câu hỏi của người dùng: "..."
        Câu trả lời của Rasa: "..."
        Dữ liệu liên quan:
        {dữ liệu}
    Nếu có câu trả lời của Rasa, hãy trả lời lại theo văn phong của bạn cho mượt mà và chuyên nghiệp hơn! Còn nếu có dữ liệu liên quan, hãy thêm các thẻ HTML, rồi các thuộc tính CSS để bố cục trở nên thật đẹp mắt.
    11. Trước khi trả ra thì nên có câu dẫn: Ví dụ như: Dưới đây là thông tin chi tiết về sản phẩm bạn yêu cầu:
    12. Chỉ trả về nội dung HTML theo khung tôi gợi ý cho bạn. Không thêm \`\`\`html hoặc bất kỳ ký tự markdown nào khác.

    Đây là mẫu HTML:
    <div id="product-template" role="group" aria-label="Sản phẩm" style="margin-top: 12px; display:flex;justify-content:flex-start;align-items:flex-start;box-sizing:border-box;padding:0;margin:0;gap:8px;max-width:520px;border-radius:6px;font-family:Arial,Helvetica,sans-serif;">
      <div dir="ltr" style="display:flex;flex-direction:column;justify-content:flex-start;align-items:center;flex:0 0 auto;padding:0;margin:0;">
        <img src="[Link ảnh]" alt="[Tên sản phẩm]" style="width:80px;height:70px;object-fit:contain;object-position:center;">
      </div>
      <div dir="ltr" style="display:flex;flex-direction:column;justify-content:flex-start;flex:1 1 50px;padding:0;margin:0;min-width:0;">
        <p aria-hidden="false" style="font-size:12px;color:#101519;line-height:1.33;margin:0 0 4px 0;overflow-wrap:break-word;">
          [Tên sản phẩm]
        </p>
        <p aria-live="polite" style="font-size:14px;color:#dc2626;font-weight:600;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin:0 0 6px 0;line-height:1.33;">
          [Giá tiền]
        </p>
        <div aria-hidden="true" style="display:flex;align-items:center;gap:4px;margin-bottom:6px;">
          <span style="font-size:12px;color:#767676;text-decoration:line-through;line-height:1.33;">
            [Giá gốc]
          </span>
          <span style="font-size:12px;color:red;line-height:1.33;">
            [Giảm giá]
          </span>
        </div>
        <div role="toolbar" aria-label="Hành động" style="display:flex;gap:4px;margin-top:4px;">
          <a href="[URL_FRONTEND]/product/[id_san_pham]" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
            <button type="button" tabindex="0" role="button" style="display:inline-flex;align-items:center;justify-content:center;padding:6px 8px;font-size:12px;color:#101519;background:transparent;border:none;cursor:pointer;border-radius:4px;user-select:none;">
              Xem ưu đãi
            </button>
          </a>
        </div>
      </div>
    </div>
`.trim();
@Injectable()
export class ChatBotService implements OnModuleInit {
  private readonly logger = new Logger(ChatBotService.name);
  private genAI: GoogleGenerativeAI;
  private chatSession: ChatSession;

  @InjectModel(Variant.name)
  private readonly VariantModel: SoftDeleteModel<VariantDocument>;

  constructor(private readonly configService: ConfigService) {}

  // onModuleInit vẫn giữ nguyên, nhưng gọi hàm private rõ ràng hơn
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
      10. Hiển thị thông tin về variants (màu sắc, bộ nhớ, giá cả) khi có yêu cầu chi tiết.
    `.trim();

  async onModuleInit() {
    try {
      this.initializeGeminiClient();
      this.logger.log('ChatBotService initialized successfully');
    } catch (error) {
      this.logger.error(`Initialization failed: ${error.message}`, error.stack);
      // Nếu không khởi tạo được thì nên throw lỗi để ứng dụng không chạy với trạng thái sai
      throw new Error(`Failed to initialize ChatBotService: ${error.message}`);
    }
  }

  /**
   * Khởi tạo Gemini client và chat session
   */
  private initializeGeminiClient() {
  @Cron('0 0 * * *') // Chạy mỗi ngày lúc 00:00
  async handleCron() {
    this.logger.log('Cron job started: Reloading product data');
    await this.loadProductData();
    this.logger.log('Product data reloaded successfully');
  }

  private async initializeGemini() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not configured in environment variables',
      );
    }

    // Lấy các cấu hình từ ConfigService
    const modelName = this.configService.get<string>(
      'GEMINI_MODEL',
      'gemini-2.5-flash', // Giá trị mặc định nếu không có trong env
    );
    const frontendUrl = this.configService.get<string>(
      'URL_REACT_FRONTEND',
      'http://localhost:5173',
    );

    // Thay thế placeholder trong prompt bằng URL thực tế
    const finalSystemPrompt = SYSTEM_PROMPT.replace(
      '[URL_FRONTEND]',
      frontendUrl,
    );

    this.genAI = new GoogleGenerativeAI(apiKey);
    const model = this.genAI.getGenerativeModel({ model: modelName });

    this.chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: finalSystemPrompt }] },
        {
          role: 'model',
          parts: [
            {
              text: 'Tôi đã hiểu vai trò và sẵn sàng hỗ trợ khách hàng của TechShop.',
            },
          ],
        },
      ],
    });
  }

  async askRasa(
    message: string,
    userId: string,
    userToken: string,
  ): Promise<RasaResponse | null> {
    const rasaUrl = this.configService.get<string>(
      'RASA_URL',
      'http://localhost:5005',
    );

    try {
      const response = await axios.post<RasaResponse[]>(
        `${rasaUrl}/webhooks/rest/webhook`,
        { sender: userId || 'default', message },
      );
      console.log('Rasa response data:', response.data);
      // Kiểm tra kỹ hơn nếu Rasa trả về dữ liệu
      if (response.data && response.data.length > 0) {
        return response.data[0]; // Trả về toàn bộ object đầu tiên
      }

      this.logger.warn('Rasa returned an empty response.');
      return null;
  private async loadProductData() {
    const products = await this.ProductModel.find({ isActive: true })
      .populate<{ category: Category }>({ path: 'category', select: 'name' })
      .populate<{ brand: Brand }>({ path: 'brand', select: 'name' })
      .populate<{ variants: Variant[] }>({
        path: 'variants',
        select: 'name price color memory weight isActive',
      })
      .exec();

    if (!products?.length) {
      this.logger.warn('Không tìm thấy sản phẩm nào.');
      this.productData = [];
      return;
    }

    this.logger.log(`Tạo embedding cho ${products.length} sản phẩm...`);

    // Reset product data
    this.productData = [];

    const BATCH_SIZE = 10;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      const productPromises = batch.map(async (product) => {
        const category = this.getNameFromPopulatedField(product.category);
        const brand = this.getNameFromPopulatedField(product.brand);

        // Process variants with better structure
        const variants =
          product.variants?.map((variant) => ({
            variantId: (variant as any)._id?.toString() || '',
            name: variant.name,
            price: variant.price || 0,
            colors: variant.color || [],
            memory: variant.memory,
            weight: variant.weight || 0,
            isActive: variant.isActive ?? true,
          })) || [];

        const productInfo = this.formatProductInfo(
          product,
          category,
          brand,
          variants,
        );
        const vector = await this.getEmbedding(productInfo.searchText);

        this.productData.push({
          productId: product._id.toString(),
          productName: product.name,
          description: productInfo.fullDescription,
          category,
          brand,
          variants,
          attributes: product.attributes || {},
          galleryImages: product.galleryImages || [],
          discount: product.discount || 0,
          viewCount: product.viewCount || 0,
          soldCount: product.soldCount || 0,
          averageRating: product.averageRating || 0,
          reviewCount: product.reviewCount || 0,
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
    variants: any[],
  ): {
    searchText: string;
    fullDescription: string;
  } {
    const baseInfo = product.name;
    const categoryInfo = `Danh mục: ${category}`;
    const brandInfo = `Thương hiệu: ${brand}`;
    const statusInfo = `Trạng thái: ${product.isActive ? 'Còn bán' : 'Ngừng bán'}`;

    // Tính toán giá từ variants
    const prices = variants
      .map((variant) => variant.price)
      .filter((price) => price > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // Collect all colors and memories from variants
    const colors = variants
      .flatMap((variant) => variant.colors.map((color: any) => color.colorName))
      .filter(Boolean);

    const memories = variants
      .filter((variant) => variant.memory)
      .map((variant) => `${variant.memory.ram}/${variant.memory.storage}`)
      .filter(Boolean);

    const searchText = [
      baseInfo,
      categoryInfo,
      brandInfo,
      minPrice > 0
        ? minPrice === maxPrice
          ? `Giá: ${minPrice.toLocaleString('vi-VN')} VND`
          : `Giá: ${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} VND`
        : '',
      colors.length > 0 ? `Màu sắc: ${[...new Set(colors)].join(', ')}` : '',
      memories.length > 0 ? `Bộ nhớ: ${[...new Set(memories)].join(', ')}` : '',
      product.discount > 0 ? `Giảm giá: ${product.discount}%` : '',
      statusInfo,
      product.description?.replace(/<[^>]*>/g, '') || '',
    ]
      .filter(Boolean)
      .join(' ');

    const statusColor = product.isActive ? '#4CAF50' : '#f44336';
    const discountBadge =
      product.discount > 0
        ? `<span style="background: #ff4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">-${product.discount}%</span>`
        : '';

    // Get first available image
    const firstImage =
      variants.find(
        (variant) =>
          variant.colors &&
          variant.colors.length > 0 &&
          variant.colors[0].images.length > 0,
      )?.colors[0]?.images[0] || product.galleryImages[0];

    // Build variant information
    const variantInfo =
      variants.length > 0
        ? variants
            .map((variant) => {
              const colorInfo = variant.colors
                .map((color: any) => `${color.colorName}`)
                .join(', ');

              const memoryInfo = variant.memory
                ? `${variant.memory.ram} RAM / ${variant.memory.storage} Storage`
                : 'Không có thông tin bộ nhớ';

              return `
        <div style="margin: 8px 0; padding: 6px;  border-radius: 6px;">
          <strong>${variant.name}:</strong><br>
          <span style="font-size: 13px; color: #666;">
            Màu sắc: ${colorInfo || 'Không có'}<br>
            Bộ nhớ: ${memoryInfo}<br>
            T
          </span>
        </div>
      `;
            })
            .join('')
        : '';

    const ratingStars =
      '★'.repeat(Math.floor(product.averageRating)) +
      '☆'.repeat(5 - Math.floor(product.averageRating));

    const fullDescription = `
${
  firstImage
    ? `
<div style="display: flex; align-items: flex-start; border: 1px solid #e0e0e0; border-radius: 12px; padding: 16px; margin: 8px 0; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <div style="flex-shrink: 0; margin-right: 16px;">
    <img src="${firstImage}" alt="${product.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;" />
  </div>
  <div style="flex-grow: 1;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
      <h3 style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">${product.name}</h3>
      ${discountBadge}
    </div>
    <div style="color: #666; font-size: 14px; line-height: 1.5;">
      <div style="margin-bottom: 4px;"><strong>Giá:</strong> ${
        minPrice === maxPrice
          ? `${minPrice.toLocaleString('vi-VN')} VND`
          : `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} VND`
      }</div>
      <div style="margin-bottom: 4px;"><strong>Thương hiệu:</strong> ${brand}</div>
      <div style="margin-bottom: 4px;"><strong>Danh mục:</strong> ${category}</div>
      ${product.averageRating > 0 ? `<div style="margin-bottom: 4px;"><strong>Đánh giá:</strong> ${ratingStars} (${product.averageRating}/5) - ${product.reviewCount} đánh giá</div>` : ''}
      ${variantInfo ? `<div><strong>Biến thể:</strong>${variantInfo}</div>` : ''}
    </div>
  </div>
</div>
`
    : `
<div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 16px; margin: 12px 0; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
    <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">${product.name}</h3>
    ${discountBadge}
  </div>
  <div style="color: #666; font-size: 14px; line-height: 1.5;">
    <div style="margin-bottom: 4px;"><strong>Giá:</strong> ${
      minPrice === maxPrice
        ? `${minPrice.toLocaleString('vi-VN')} VND`
        : `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} VND`
    }</div>
    <div style="margin-bottom: 4px;"><strong>Thương hiệu:</strong> ${brand}</div>
    <div style="margin-bottom: 4px;"><strong>Danh mục:</strong> ${category}</div>
    ${product.averageRating > 0 ? `<div style="margin-bottom: 4px;"><strong>Đánh giá:</strong> ${ratingStars} (${product.averageRating}/5) - ${product.reviewCount} đánh giá</div>` : ''}
    <div style="margin-bottom: 4px;"><strong>Đã bán:</strong> ${product.soldCount} sản phẩm</div>
    <div style="margin-bottom: 8px;"><strong>Trạng thái:</strong> <span style="color: ${statusColor};">${product.isActive ? 'Còn bán' : 'Ngừng bán'}</span></div>
    ${variantInfo ? `<div><strong>Variants:</strong>${variantInfo}</div>` : ''}
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

Hãy trả lời dựa vào thông tin sản phẩm trên. Nếu có nhiều sản phẩm phù hợp, hãy so sánh và đưa ra lời khuyên. Luôn hiển thị hình ảnh của sản phẩm được đề cập. Khi khách hàng hỏi về màu sắc, bộ nhớ, hoặc variants, hãy cung cấp thông tin chi tiết từ dữ liệu variants.
      `.trim();

      const result = await this.chatSession.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Error calling Rasa: ${axiosError.message}`,
        axiosError.stack,
      );
      // Throw HttpException để controller có thể bắt và trả về lỗi 502 Bad Gateway
      throw new HttpException(
        'Failed to connect to Rasa service.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getGeminiResponse(
    userInput: string,
    rasaResponse: RasaResponse | null,
  ): Promise<string> {
    if (!userInput?.trim()) {
      return 'Vui lòng nhập câu hỏi.';
    }

    // Xây dựng prompt một cách rõ ràng hơn
    const promptParts: string[] = [`Câu hỏi của người dùng: "${userInput}"`];

    if (rasaResponse?.text) {
      promptParts.push(`Câu trả lời của Rasa: "${rasaResponse.text}"`);
    } else if (rasaResponse?.custom) {
      promptParts.push(
        `Dữ liệu liên quan: ${JSON.stringify(rasaResponse.custom, null, 2)}`,
      );
    }

    const prompt = promptParts.join('\n');
  // Utility methods cho sản phẩm với enhanced functionality
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

  findProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): ProductWithEmbedding[] {
    return this.productData.filter((product) =>
      product.variants.some(
        (variant) => variant.price >= minPrice && variant.price <= maxPrice,
      ),
    );
  }

  findProductsByColor(colorName: string): ProductWithEmbedding[] {
    return this.productData.filter((product) =>
      product.variants.some((variant) =>
        variant.colors.some((color) =>
          color.colorName.toLowerCase().includes(colorName.toLowerCase()),
        ),
      ),
    );
  }

  findProductsByMemory(
    ramSize?: string,
    storageSize?: string,
  ): ProductWithEmbedding[] {
    return this.productData.filter((product) =>
      product.variants.some((variant) => {
        if (!variant.memory) return false;

        let matches = true;
        if (ramSize) {
          matches =
            matches &&
            variant.memory.ram.toLowerCase().includes(ramSize.toLowerCase());
        }
        if (storageSize) {
          matches =
            matches &&
            variant.memory.storage
              .toLowerCase()
              .includes(storageSize.toLowerCase());
        }

        return matches;
      }),
    );
  }

  getTopRatedProducts(limit = 10): ProductWithEmbedding[] {
    return this.productData
      .filter((product) => product.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
  }

  getBestSellingProducts(limit = 10): ProductWithEmbedding[] {
    return this.productData
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, limit);
  }

    try {
      const result = await this.chatSession.sendMessage(prompt);
      const textResponse = result.response.text();
      console.log('Gemini response:', textResponse);
      // Dọn dẹp markdown code block
      return textResponse.replace(/```html|```/g, '').trim();
    } catch (error) {
      this.logger.error(
        `Error processing Gemini request: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to get response from Gemini.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getProductStatistics(): {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalBrands: number;
    averagePrice: number;
    totalVariants: number;
  } {
    const activeProducts = this.getAllActiveProducts();
    const categories = new Set(activeProducts.map((p) => p.category));
    const brands = new Set(activeProducts.map((p) => p.brand));
    const allPrices = activeProducts.flatMap((p) =>
      p.variants.map((v) => v.price).filter((price) => price > 0),
    );
    const totalVariants = activeProducts.reduce(
      (sum, p) => sum + p.variants.length,
      0,
    );

    return {
      totalProducts: this.productData.length,
      activeProducts: activeProducts.length,
      totalCategories: categories.size,
      totalBrands: brands.size,
      averagePrice:
        allPrices.length > 0
          ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
          : 0,
      totalVariants,
    };
  }
}
