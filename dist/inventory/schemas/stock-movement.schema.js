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
exports.StockMovementSchema = exports.StockMovement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const branch_schema_1 = require("../../branch/schemas/branch.schema");
const transaction_enum_1 = require("../../constant/transaction.enum");
const product_schema_1 = require("../../product/schemas/product.schema");
const variant_schema_1 = require("../../product/schemas/variant.schema");
let StockMovement = class StockMovement {
};
exports.StockMovement = StockMovement;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: product_schema_1.Products.name,
        required: true,
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], StockMovement.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: branch_schema_1.Branch.name,
        required: true,
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], StockMovement.prototype, "branchId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                variantId: { type: mongoose_2.default.Types.ObjectId, ref: variant_schema_1.Variant.name },
                quantity: { type: Number },
                cost: { type: Number, default: 0, min: 0 },
            },
        ],
    }),
    __metadata("design:type", Array)
], StockMovement.prototype, "variants", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: transaction_enum_1.TransactionType,
        required: true,
    }),
    __metadata("design:type", String)
], StockMovement.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StockMovement.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: transaction_enum_1.TransactionSource }),
    __metadata("design:type", String)
], StockMovement.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId }),
    __metadata("design:type", String)
], StockMovement.prototype, "relatedId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            email: String,
            name: String,
        },
    }),
    __metadata("design:type", Object)
], StockMovement.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            email: String,
            name: String,
        },
    }),
    __metadata("design:type", Object)
], StockMovement.prototype, "updatedBy", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], StockMovement);
exports.StockMovementSchema = mongoose_1.SchemaFactory.createForClass(StockMovement);
//# sourceMappingURL=stock-movement.schema.js.map