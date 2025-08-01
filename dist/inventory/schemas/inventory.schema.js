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
exports.InventorySchema = exports.Inventory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("../../product/schemas/product.schema");
const branch_schema_1 = require("../../branch/schemas/branch.schema");
const mongoose_2 = __importDefault(require("mongoose"));
const variant_schema_1 = require("../../product/schemas/variant.schema");
let Inventory = class Inventory {
};
exports.Inventory = Inventory;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: branch_schema_1.Branch.name,
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Inventory.prototype, "branch", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: product_schema_1.Products.name,
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Inventory.prototype, "product", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        _id: false,
        type: [
            {
                variantId: { type: mongoose_2.default.Types.ObjectId, ref: variant_schema_1.Variant.name },
                stock: { type: Number },
                cost: { type: Number, default: 0, min: 0 },
            },
        ],
    }),
    __metadata("design:type", Array)
], Inventory.prototype, "variants", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Inventory.prototype, "minStockLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Inventory.prototype, "maxStockLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Inventory.prototype, "lastRestockedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: true,
        index: true,
    }),
    __metadata("design:type", Boolean)
], Inventory.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            email: String,
            name: String,
        },
    }),
    __metadata("design:type", Object)
], Inventory.prototype, "lastUpdatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            email: String,
            name: String,
        },
    }),
    __metadata("design:type", Object)
], Inventory.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Inventory.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Inventory.prototype, "updatedAt", void 0);
exports.Inventory = Inventory = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Inventory);
exports.InventorySchema = mongoose_1.SchemaFactory.createForClass(Inventory);
//# sourceMappingURL=inventory.schema.js.map