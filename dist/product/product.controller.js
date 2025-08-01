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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const publicDecorator_1 = require("../decorator/publicDecorator");
const messageDecorator_1 = require("../decorator/messageDecorator");
const swagger_1 = require("@nestjs/swagger");
const policies_guard_1 = require("../common/guards/policies.guard");
const review_service_1 = require("../review/review.service");
let ProductController = class ProductController {
    constructor(productService, reviewService) {
        this.productService = productService;
        this.reviewService = reviewService;
    }
    create(createProductDto) {
        return this.productService.create(createProductDto);
    }
    findAll(currentPage, limit, qs) {
        return this.productService.findAll(+currentPage, +limit, qs);
    }
    findOne(id) {
        return this.productService.findOneById(id);
    }
    async autocomplete(query) {
        return this.productService.autocompleteSearch(query);
    }
    async getRatingStats(productId) {
        const stats = await this.reviewService.getProductRatingStats(productId);
        return {
            success: true,
            data: stats,
        };
    }
    update(id, updateProductDto) {
        return this.productService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productService.remove(id);
    }
    setViewCount(id) {
        return this.productService.countViews(id);
    }
    setOrderCount(id) {
        return this.productService.countOrders(id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, publicDecorator_1.Public)(),
    (0, messageDecorator_1.ResponseMessage)('Lấy danh sách sản phẩm thành công'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, publicDecorator_1.Public)(),
    (0, messageDecorator_1.ResponseMessage)('Lấy sản phẩm thành công'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, publicDecorator_1.Public)(),
    (0, common_1.Get)('/search/autocomplete'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "autocomplete", null);
__decorate([
    (0, publicDecorator_1.Public)(),
    (0, common_1.Get)(':productId/rating-stats'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getRatingStats", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('/:id/view-count'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "setViewCount", null);
__decorate([
    (0, common_1.Patch)('/:id/order-count'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "setOrderCount", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('api/v1/products'),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        review_service_1.ReviewService])
], ProductController);
//# sourceMappingURL=product.controller.js.map