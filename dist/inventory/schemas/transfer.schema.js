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
exports.TransferSchema = exports.Transfer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importStar(require("mongoose"));
const branch_schema_1 = require("../../branch/schemas/branch.schema");
const transaction_enum_1 = require("../../constant/transaction.enum");
const product_schema_1 = require("../../product/schemas/product.schema");
const variant_schema_1 = require("../../product/schemas/variant.schema");
const user_schema_1 = require("../../user/schemas/user.schema");
let Transfer = class Transfer {
};
exports.Transfer = Transfer;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: branch_schema_1.Branch.name,
        required: true,
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Transfer.prototype, "fromBranchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: branch_schema_1.Branch.name,
        required: true,
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Transfer.prototype, "toBranchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                productId: {
                    type: mongoose_2.default.Schema.Types.ObjectId,
                    ref: product_schema_1.Products.name,
                },
                quantity: { type: Number, required: true },
                variantId: {
                    type: mongoose_2.default.Schema.Types.ObjectId,
                    ref: variant_schema_1.Variant.name,
                },
                unit: { type: String },
            },
        ],
    }),
    __metadata("design:type", Array)
], Transfer.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: transaction_enum_1.TransactionStatus, default: transaction_enum_1.TransactionStatus.PENDING }),
    __metadata("design:type", String)
], Transfer.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name }),
    __metadata("design:type", Array)
], Transfer.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Transfer.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Transfer.prototype, "rejectNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Transfer.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            email: String,
            name: String,
        },
    }),
    __metadata("design:type", Object)
], Transfer.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            email: String,
            name: String,
        },
    }),
    __metadata("design:type", Object)
], Transfer.prototype, "updatedBy", void 0);
exports.Transfer = Transfer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Transfer);
exports.TransferSchema = mongoose_1.SchemaFactory.createForClass(Transfer);
//# sourceMappingURL=transfer.schema.js.map