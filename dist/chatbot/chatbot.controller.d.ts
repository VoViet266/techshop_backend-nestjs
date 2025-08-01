import { ChatBotService } from './chatbot.service';
export declare class ChatBotController {
    private readonly chatService;
    constructor(chatService: ChatBotService);
    sendMessage(message: string): Promise<{
        reply: string;
    }>;
}
