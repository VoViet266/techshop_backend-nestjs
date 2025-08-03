import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
interface ProductWithEmbedding {
    productId: string;
    productName: string;
    description: string;
    price: number;
    imagesMain: string;
    category: string;
    brand: string;
    isActive: boolean;
    vector: number[];
    score?: number;
}
export declare class ChatBotService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private genAI;
    private chatSession;
    private productData;
    private readonly ProductModel;
    constructor(configService: ConfigService);
    private readonly SYSTEM_PROMPT;
    onModuleInit(): Promise<void>;
    private initializeGemini;
    private loadProductData;
    private formatProductInfo;
    private getNameFromPopulatedField;
    sendMessage(userInput: string): Promise<string>;
    private getEmbedding;
    private findRelevantProducts;
    private calculateCosineSimilarity;
    getProductById(productId: string): ProductWithEmbedding | undefined;
    findProductsByCategory(categoryName: string): ProductWithEmbedding[];
    findProductsByBrand(brandName: string): ProductWithEmbedding[];
    getAllActiveProducts(): ProductWithEmbedding[];
}
export {};
