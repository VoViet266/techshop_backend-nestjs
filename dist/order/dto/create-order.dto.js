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
exports.CreateOrderDto = exports.CartItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CartItemDto {
}
exports.CartItemDto = CartItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3d',
        description: 'ID sản phẩm',
    }),
    __metadata("design:type", String)
], CartItemDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Số lượng sản phẩm' }),
    __metadata("design:type", Number)
], CartItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3d',
        description: 'ID chi nhánh nơi đặt hàng',
    }),
    __metadata("design:type", String)
], CartItemDto.prototype, "branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1500,
        description: 'Giá của sản phẩm tại thời điểm đặt hàng',
    }),
    __metadata("design:type", Number)
], CartItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3e',
        description: 'ID biến thể sản phẩm',
    }),
    __metadata("design:type", String)
], CartItemDto.prototype, "variant", void 0);
class RecipientDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "note", void 0);
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'userId123' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RecipientDto),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", RecipientDto)
], CreateOrderDto.prototype, "recipient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3f',
        description: 'ID người dùng',
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RecipientDto),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", RecipientDto)
], CreateOrderDto.prototype, "buyer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CartItemDto] }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500 }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3f',
        description: 'ID chi nhánh nơi đặt hàng',
    }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending', description: 'Trạng thái đơn hàng' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending', description: 'Trạng thái đơn hàng' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "returnStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'credit_card',
        description: 'Phương thức thanh toán',
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=create-order.dto.js.map