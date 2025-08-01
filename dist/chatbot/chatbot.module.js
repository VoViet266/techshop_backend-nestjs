"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotModule = void 0;
const common_1 = require("@nestjs/common");
const chatbot_service_1 = require("./chatbot.service");
const chatbot_controller_1 = require("./chatbot.controller");
const product_module_1 = require("../product/product.module");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const create_product_dto_1 = require("../product/dto/create-product.dto");
const product_schema_1 = require("../product/schemas/product.schema");
let ChatbotModule = class ChatbotModule {
};
exports.ChatbotModule = ChatbotModule;
exports.ChatbotModule = ChatbotModule = __decorate([
    (0, common_1.Module)({
        controllers: [chatbot_controller_1.ChatBotController],
        providers: [chatbot_service_1.ChatBotService],
        imports: [
            product_module_1.ProductModule,
            mongoose_1.MongooseModule.forFeature([
                { name: create_product_dto_1.ProductSpecsDto.name, schema: product_schema_1.ProductSchema },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env.development.local',
            }),
        ],
    })
], ChatbotModule);
//# sourceMappingURL=chatbot.module.js.map