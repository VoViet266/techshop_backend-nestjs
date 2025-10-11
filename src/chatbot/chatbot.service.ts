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

  constructor(private readonly configService: ConfigService) {}

  // onModuleInit vẫn giữ nguyên, nhưng gọi hàm private rõ ràng hơn
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
        { sender: userId || 'default', message, access_token: accessToken },
      );
      console.log('Rasa response data:', response.data);
      // Kiểm tra kỹ hơn nếu Rasa trả về dữ liệu
      if (response.data && response.data.length > 0) {
        return response.data[0]; // Trả về toàn bộ object đầu tiên
      }

      this.logger.warn('Rasa returned an empty response.');
      return null;
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
}
