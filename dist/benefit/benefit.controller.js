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
exports.ProductBenefitController = void 0;
const common_1 = require("@nestjs/common");
const benefit_service_1 = require("./benefit.service");
const publicDecorator_1 = require("../decorator/publicDecorator");
let ProductBenefitController = class ProductBenefitController {
    constructor(benefitService) {
        this.benefitService = benefitService;
    }
    createPromotion(body) {
        return this.benefitService.createPromotion(body);
    }
    getAllPromotions() {
        return this.benefitService.getAllPromotions();
    }
    getPromotionById(id) {
        return this.benefitService.getPromotionById(id);
    }
    updatePromotion(id, body) {
        return this.benefitService.updatePromotion(id, body);
    }
    deletePromotion(id) {
        return this.benefitService.deletePromotion(id);
    }
    createWarranty(body) {
        return this.benefitService.createWarrantyPolicy(body);
    }
    getAllWarranties() {
        return this.benefitService.getAllWarranties();
    }
    getWarrantyById(id) {
        return this.benefitService.getWarrantyById(id);
    }
    updateWarranty(id, body) {
        return this.benefitService.updateWarranty(id, body);
    }
    deleteWarranty(id) {
        return this.benefitService.deleteWarranty(id);
    }
};
exports.ProductBenefitController = ProductBenefitController;
__decorate([
    (0, common_1.Post)('promotions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "createPromotion", null);
__decorate([
    (0, common_1.Get)('promotions'),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "getAllPromotions", null);
__decorate([
    (0, common_1.Get)('promotions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "getPromotionById", null);
__decorate([
    (0, common_1.Patch)('promotions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "updatePromotion", null);
__decorate([
    (0, common_1.Delete)('promotions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "deletePromotion", null);
__decorate([
    (0, common_1.Post)('warranties'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "createWarranty", null);
__decorate([
    (0, common_1.Get)('warranties'),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "getAllWarranties", null);
__decorate([
    (0, common_1.Get)('warranties/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "getWarrantyById", null);
__decorate([
    (0, common_1.Patch)('warranties/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "updateWarranty", null);
__decorate([
    (0, common_1.Delete)('warranties/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductBenefitController.prototype, "deleteWarranty", null);
exports.ProductBenefitController = ProductBenefitController = __decorate([
    (0, common_1.Controller)('api/v1/benefits'),
    __metadata("design:paramtypes", [benefit_service_1.ProductBenefitService])
], ProductBenefitController);
//# sourceMappingURL=benefit.controller.js.map