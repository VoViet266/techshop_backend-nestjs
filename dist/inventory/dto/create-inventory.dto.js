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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransferDto = exports.CreateStockMovementDto = exports.CreateInventoryDto = exports.VariantDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class VariantDto {
}
exports.VariantDto = VariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Số lượng tồn kho của biến thể' }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VariantDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Giá vốn của biến thể' }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VariantDto.prototype, "cost", void 0);
class CreateInventoryDto {
}
exports.CreateInventoryDto = CreateInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3e',
        description: 'ID cửa hàng',
    }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3f',
        description: 'ID sản phẩm',
    }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "product", void 0);
class CreateStockMovementDto {
}
exports.CreateStockMovementDto = CreateStockMovementDto;
class CreateTransferDto {
}
exports.CreateTransferDto = CreateTransferDto;
//# sourceMappingURL=create-inventory.dto.js.map