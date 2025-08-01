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
exports.VariantSchema = exports.Variant = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Variant = class Variant {
};
exports.Variant = Variant;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Variant.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        min: 0,
    }),
    __metadata("design:type", Number)
], Variant.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
    }),
    __metadata("design:type", Object)
], Variant.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Variant.prototype, "memory", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], Variant.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Variant.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Variant.prototype, "isActive", void 0);
exports.Variant = Variant = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        strict: true,
    })
], Variant);
exports.VariantSchema = mongoose_1.SchemaFactory.createForClass(Variant);
//# sourceMappingURL=variant.schema.js.map