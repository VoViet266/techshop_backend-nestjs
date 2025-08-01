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
exports.ProductBenefitService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const promotion_schema_1 = require("../benefit/schemas/promotion.schema");
const warrantypolicy_schema_1 = require("../benefit/schemas/warrantypolicy.schema");
let ProductBenefitService = class ProductBenefitService {
    constructor(promotionModel, warrantyModel) {
        this.promotionModel = promotionModel;
        this.warrantyModel = warrantyModel;
    }
    async createPromotion(data) {
        return this.promotionModel.create(data);
    }
    async getAllPromotions() {
        return this.promotionModel.find();
    }
    async getPromotionById(id) {
        return this.promotionModel.findById(id);
    }
    async updatePromotion(id, data) {
        return this.promotionModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deletePromotion(id) {
        return this.promotionModel.findByIdAndDelete(id);
    }
    async createWarrantyPolicy(data) {
        return this.warrantyModel.create(data);
    }
    async getAllWarranties() {
        return this.warrantyModel.find();
    }
    async getWarrantyById(id) {
        return this.warrantyModel.findById(id);
    }
    async updateWarranty(id, data) {
        return this.warrantyModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteWarranty(id) {
        return this.warrantyModel.findByIdAndDelete(id);
    }
};
exports.ProductBenefitService = ProductBenefitService;
exports.ProductBenefitService = ProductBenefitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(promotion_schema_1.Promotion.name)),
    __param(1, (0, mongoose_1.InjectModel)(warrantypolicy_schema_1.WarrantyPolicy.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProductBenefitService);
//# sourceMappingURL=benefit.service.js.map