"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.Order = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importStar(require("mongoose"));
const promotion_schema_1 = require("../../benefit/schemas/promotion.schema");
const branch_schema_1 = require("../../branch/schemas/branch.schema");
const orderStatus_enum_1 = require("../../constant/orderStatus.enum");
const payment_enum_1 = require("../../constant/payment.enum");
const product_schema_1 = require("../../product/schemas/product.schema");
const variant_schema_1 = require("../../product/schemas/variant.schema");
const user_schema_1 = require("../../user/schemas/user.schema");
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: user_schema_1.User.name }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Order.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            note: { type: String },
        },
    }),
    __metadata("design:type", Object)
], Order.prototype, "recipient", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
        },
    }),
    __metadata("design:type", Object)
], Order.prototype, "buyer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                product: {
                    type: mongoose_2.default.Schema.Types.ObjectId,
                    ref: product_schema_1.Products.name,
                    required: true,
                },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                variant: {
                    type: mongoose_2.default.Schema.Types.ObjectId,
                    ref: variant_schema_1.Variant.name,
                    required: true,
                },
                branch: {
                    type: mongoose_2.default.Schema.Types.ObjectId,
                    ref: branch_schema_1.Branch.name,
                    required: true,
                },
            },
        ],
    }),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                promotionId: {
                    type: mongoose_2.default.Schema.Types.ObjectId,
                    ref: promotion_schema_1.Promotion.name,
                },
                title: { type: String },
                valueType: { type: String, enum: ['percent', 'fixed'] },
                value: { type: Number },
                discountAmount: { type: Number },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Order.prototype, "appliedPromotions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Order.prototype, "discountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: payment_enum_1.OrderSource }),
    __metadata("design:type", String)
], Order.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: orderStatus_enum_1.OrderStatus, default: orderStatus_enum_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: payment_enum_1.PaymentStatus, default: payment_enum_1.PaymentStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Payment' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "payment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: payment_enum_1.PaymentMethod }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "isReturned", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['requested', 'approved', 'rejected', 'completed', 'not_returned'],
        default: 'not_returned',
    }),
    __metadata("design:type", String)
], Order.prototype, "returnStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "returnReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Order.prototype, "returnProcessedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
    }),
    __metadata("design:type", Object)
], Order.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Order.prototype, "updatedBy", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=order.schema.js.map