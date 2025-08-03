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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.Products = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("@nestjs/mongoose");
const brand_schema_1 = require("../../brand/schemas/brand.schema");
const category_schema_1 = require("../../category/schemas/category.schema");
const variant_schema_1 = require("./variant.schema");
const soft_delete_plugin_mongoose_1 = require("soft-delete-plugin-mongoose");
let Products = class Products {
};
exports.Products = Products;
__decorate([
    (0, mongoose_2.Prop)({
        unique: true,
        index: true,
        trim: true,
    }),
    __metadata("design:type", String)
], Products.prototype, "name", void 0);
__decorate([
    (0, mongoose_2.Prop)({ trim: true }),
    __metadata("design:type", String)
], Products.prototype, "description", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Products.prototype, "discount", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: category_schema_1.Category.name,
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_1.default.Schema.Types.ObjectId)
], Products.prototype, "category", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: brand_schema_1.Brand.name,
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_1.default.Schema.Types.ObjectId)
], Products.prototype, "brand", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: variant_schema_1.Variant.name,
    }),
    __metadata("design:type", Array)
], Products.prototype, "variants", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: mongoose_1.default.Schema.Types.Mixed, default: {} }),
    __metadata("design:type", Object)
], Products.prototype, "attributes", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: [String],
        default: [],
    }),
    __metadata("design:type", Array)
], Products.prototype, "galleryImages", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Products.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Products.prototype, "soldCount", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        default: 0,
        min: 0,
        max: 5,
    }),
    __metadata("design:type", Number)
], Products.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Products.prototype, "reviewCount", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        default: true,
    }),
    __metadata("design:type", Boolean)
], Products.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Products.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: {
            email: String,
            name: String,
        },
    }),
    __metadata("design:type", Object)
], Products.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        type: {
            email: String,
            name: String,
        },
    }),
    __metadata("design:type", Object)
], Products.prototype, "updatedBy", void 0);
exports.Products = Products = __decorate([
    (0, mongoose_2.Schema)({
        timestamps: true,
    })
], Products);
exports.ProductSchema = mongoose_2.SchemaFactory.createForClass(Products);
exports.ProductSchema.index({ isActive: 1, createdAt: -1 });
exports.ProductSchema.index({ tags: 1, isActive: 1 });
exports.ProductSchema.index({ slug: 1 }, { unique: true });
exports.ProductSchema.plugin(soft_delete_plugin_mongoose_1.softDeletePlugin);
//# sourceMappingURL=product.schema.js.map