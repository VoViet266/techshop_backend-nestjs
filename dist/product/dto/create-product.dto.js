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
exports.CreateProductDto = exports.VariantDto = exports.VariantMemoryDto = exports.VariantColorDto = exports.CameraDto = exports.CameraRearDto = exports.CameraFrontDto = exports.ConnectivityDto = exports.ProductSpecsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ProductSpecsDto {
}
exports.ProductSpecsDto = ProductSpecsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '6.5 inch',
        description: 'Kích thước màn hình',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductSpecsDto.prototype, "displaySize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'OLED', description: 'Loại màn hình' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductSpecsDto.prototype, "displayType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Snapdragon 888', description: 'Bộ xử lý' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductSpecsDto.prototype, "processor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Android 11', description: 'Hệ điều hành' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductSpecsDto.prototype, "operatingSystem", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '4000mAh', description: 'Dung lượng pin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductSpecsDto.prototype, "battery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '180g', description: 'Trọng lượng' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductSpecsDto.prototype, "weight", void 0);
class ConnectivityDto {
}
exports.ConnectivityDto = ConnectivityDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '802.11 a/b/g/n/ac',
        description: 'Chuẩn WiFi',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConnectivityDto.prototype, "wifi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '5.0', description: 'Phiên bản Bluetooth' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConnectivityDto.prototype, "bluetooth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '4G LTE', description: 'Kết nối di động' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConnectivityDto.prototype, "cellular", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Hỗ trợ NFC hay không' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ConnectivityDto.prototype, "nfc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Hỗ trợ GPS hay không' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ConnectivityDto.prototype, "gps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['USB-C', '3.5mm jack'],
        description: 'Cổng kết nối',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ConnectivityDto.prototype, "ports", void 0);
class CameraFrontDto {
}
exports.CameraFrontDto = CameraFrontDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12MP', description: 'Độ phân giải camera trước' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CameraFrontDto.prototype, "resolution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['HDR', 'Panorama'],
        description: 'Tính năng camera trước',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CameraFrontDto.prototype, "features", void 0);
class CameraRearDto {
}
exports.CameraRearDto = CameraRearDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '48MP', description: 'Độ phân giải camera sau' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CameraRearDto.prototype, "resolution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['OIS', 'Night mode'],
        description: 'Tính năng camera sau',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CameraRearDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Số lượng ống kính' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CameraRearDto.prototype, "lensCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['4K', 'Slow motion'],
        description: 'Tính năng quay video',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CameraRearDto.prototype, "videoRecording", void 0);
class CameraDto {
}
exports.CameraDto = CameraDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: CameraFrontDto, description: 'Thông số camera trước' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CameraFrontDto),
    __metadata("design:type", CameraFrontDto)
], CameraDto.prototype, "front", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CameraRearDto, description: 'Thông số camera sau' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CameraRearDto),
    __metadata("design:type", CameraRearDto)
], CameraDto.prototype, "rear", void 0);
class VariantColorDto {
}
exports.VariantColorDto = VariantColorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Red', description: 'Tên màu sắc' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VariantColorDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#FF0000', description: 'Mã màu hex' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VariantColorDto.prototype, "hex", void 0);
class VariantMemoryDto {
}
exports.VariantMemoryDto = VariantMemoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '8GB', description: 'Dung lượng RAM' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VariantMemoryDto.prototype, "ram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '128GB', description: 'Dung lượng lưu trữ' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VariantMemoryDto.prototype, "storage", void 0);
class VariantDto {
}
exports.VariantDto = VariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Standard', description: 'Tên biến thể' }),
    __metadata("design:type", String)
], VariantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 999, description: 'Giá bán' }),
    __metadata("design:type", Number)
], VariantDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: VariantColorDto, description: 'Thông tin màu sắc' }),
    __metadata("design:type", VariantColorDto)
], VariantDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: VariantMemoryDto, description: 'Thông tin bộ nhớ' }),
    __metadata("design:type", VariantMemoryDto)
], VariantDto.prototype, "memory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['image1.jpg', 'image2.jpg'],
        description: 'Danh sách hình ảnh',
    }),
    __metadata("design:type", Array)
], VariantDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 200, description: 'Trọng lượng (gram)' }),
    __metadata("design:type", Number)
], VariantDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Trạng thái kích hoạt' }),
    __metadata("design:type", Boolean)
], VariantDto.prototype, "isActive", void 0);
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
//# sourceMappingURL=create-product.dto.js.map