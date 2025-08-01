"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationModule = void 0;
const common_1 = require("@nestjs/common");
const recommendation_service_1 = require("./recommendation.service");
const recommendation_controller_1 = require("./recommendation.controller");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("../product/schemas/product.schema");
const product_module_1 = require("../product/product.module");
const view_histories_schema_1 = require("./schemas/view_histories.schema");
const tfidf_mode_schema_1 = require("../tfidf-mode/schemas/tfidf-mode.schema");
let RecommendationModule = class RecommendationModule {
};
exports.RecommendationModule = RecommendationModule;
exports.RecommendationModule = RecommendationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            product_module_1.ProductModule,
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.Products.name, schema: product_schema_1.ProductSchema },
                { name: view_histories_schema_1.ViewHistory.name, schema: view_histories_schema_1.ViewHistorySchema },
                { name: tfidf_mode_schema_1.TfidfModel.name, schema: tfidf_mode_schema_1.TfidfModelSchema },
            ]),
        ],
        controllers: [recommendation_controller_1.RecommendationController],
        providers: [recommendation_service_1.RecommendationService],
    })
], RecommendationModule);
//# sourceMappingURL=recommendation.module.js.map