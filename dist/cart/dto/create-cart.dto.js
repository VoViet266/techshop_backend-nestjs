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
exports.CreateCartDto = exports.CartItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
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
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3e',
        description: 'ID biến thể sản phẩm',
    }),
    __metadata("design:type", Object)
], CartItemDto.prototype, "variant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Số lượng sản phẩm' }),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CartItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50000,
        description: 'Giá sản phẩm tại thời điểm mua',
    }),
    __metadata("design:type", Number)
], CartItemDto.prototype, "price", void 0);
class CreateCartDto {
}
exports.CreateCartDto = CreateCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64a2b3c4d5e6f7890a1b2c3f',
        description: 'ID người dùng',
    }),
    __metadata("design:type", Object)
], CreateCartDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CartItemDto],
        description: 'Danh sách các sản phẩm trong giỏ hàng',
    }),
    __metadata("design:type", Array)
], CreateCartDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3, description: 'Tổng số lượng sản phẩm' }),
    __metadata("design:type", Number)
], CreateCartDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 150000,
        description: 'Tổng giá trị giỏ hàng',
    }),
    __metadata("design:type", Number)
], CreateCartDto.prototype, "totalPrice", void 0);
//# sourceMappingURL=create-cart.dto.js.map