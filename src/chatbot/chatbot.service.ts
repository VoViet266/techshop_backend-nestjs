import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GoogleGenerativeAI,
  ChatSession,
} from '@google/generative-ai';
import axios from 'axios';

@Injectable()
export class ChatBotService implements OnModuleInit {
  private readonly logger = new Logger(ChatBotService.name);
  private genAI: GoogleGenerativeAI;
  private chatSession: ChatSession;

  constructor(private readonly configService: ConfigService) { }

  private readonly SYSTEM_PROMPT = `
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
      12. Chỉ trả về nội dung HTML thuần, định dạng lại cho thật đẹp và chuyên nghiệp, không cần border vì đã có rồi. Không thêm \`\`\`html hoặc bất kỳ ký tự markdown nào khác.  
    `.trim();

  async onModuleInit() {
    try {
      await this.initializeGemini();
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
      model: 'gemini-2.0-flash',
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

  async askRasa(message: string, userId: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.configService.get<string>('RASA_URL') || 'http://localhost:5005'}/webhooks/rest/webhook`,
        { sender: userId || 'default', message: message },
      );
      if (response.status === 200) {
        return response.data[0].text || response.data[0].custom;
      }
    } catch (error) {
      this.logger.error(`Lỗi Rasa: ${error.message}`);
      return 'Đã xảy ra lỗi, vui lòng thử lại sau.';
    }
  }

  async sendMessage(
    userInput: string,
    rasaResponse: object | string | any[],
  ): Promise<string> {
    if (!userInput?.trim()) return 'Vui lòng nhập câu hỏi.';

    try {
      const prompt = `
        Câu hỏi của người dùng: "${userInput}"
        ${typeof rasaResponse === "string" ? `Câu trả lời của Rasa: "${rasaResponse}"` : ""}
        ${typeof rasaResponse === "object" || Array.isArray(rasaResponse)
          ? `Dữ liệu liên quan: ${JSON.stringify(rasaResponse, null, 2)}`
          : ""}
      `;

      const result = await this.chatSession.sendMessage(prompt);
      return result.response.text().replace(/```html|```/g, '').trim();
    } catch (error) {
      this.logger.error(`Lỗi xử lý: ${error.message}`, error.stack);
      return 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.';
    }
  }
}
