"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationController = void 0;
const common_1 = require("@nestjs/common");
const recommendation_service_1 = require("./recommendation.service");
const publicDecorator_1 = require("../decorator/publicDecorator");
const record_dto_1 = require("./dto/record.dto");
let RecommendationController = class RecommendationController {
    constructor(recommendationService) {
        this.recommendationService = recommendationService;
    }
    async getRecommendedProducts(productId, limit = '4') {
        return this.recommendationService.getRecommendedProducts(productId, parseInt(limit, 10));
    }
    async recordViewHistory(recordDto) {
        if (!recordDto.userId || !recordDto.productId) {
            throw new common_1.BadRequestException('userId and productId are required');
        }
        return this.recommendationService.recordViewHistory(recordDto.userId, recordDto.productId);
    }
    async getRecommendationsByUser(userId) {
        return this.recommendationService.getRecommendationsForUser(userId);
    }
    async getPopularProducts(limit = '10') {
        return this.recommendationService.getPopularProducts(parseInt(limit, 10));
    }
    async getBrandBasedRecommendations(brandId, limit = '10') {
        return this.recommendationService.getBrandBasedRecommendations(brandId, parseInt(limit, 10));
    }
    async getCategoryBasedRecommendations(categoryId, limit = '10') {
        return this.recommendationService.getCategoryBasedRecommendations(categoryId, parseInt(limit, 10));
    }
};
exports.RecommendationController = RecommendationController;
__decorate([
    (0, publicDecorator_1.Public)(),
    (0, common_1.Get)('recommend/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "getRecommendedProducts", null);
__decorate([
    (0, common_1.Post)('recommend/record-view-history'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_dto_1.RecordDto]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "recordViewHistory", null);
__decorate([
    (0, common_1.Get)('recommend/get-by-user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "getRecommendationsByUser", null);
__decorate([
    (0, common_1.Get)('/recommend/recommendation/get-popular'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "getPopularProducts", null);
__decorate([
    (0, common_1.Get)('/recommend/recommendation/get-brand-based'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Query)('brandId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "getBrandBasedRecommendations", null);
__decorate([
    (0, common_1.Get)('/recommend/recommendation/get-category-based/:id'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "getCategoryBasedRecommendations", null);
exports.RecommendationController = RecommendationController = __decorate([
    (0, common_1.Controller)('api/v1'),
    __metadata("design:paramtypes", [recommendation_service_1.RecommendationService])
], RecommendationController);
//# sourceMappingURL=recommendation.controller.js.map