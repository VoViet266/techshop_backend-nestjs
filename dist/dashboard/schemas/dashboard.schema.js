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
exports.DashboardStatsSchema = exports.Dashboard = exports.PaymentMethodStats = exports.ProductStats = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ProductStats = class ProductStats {
};
exports.ProductStats = ProductStats;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductStats.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductStats.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ProductStats.prototype, "soldCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ProductStats.prototype, "revenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ProductStats.prototype, "viewCount", void 0);
exports.ProductStats = ProductStats = __decorate([
    (0, mongoose_1.Schema)()
], ProductStats);
let PaymentMethodStats = class PaymentMethodStats {
};
exports.PaymentMethodStats = PaymentMethodStats;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentMethodStats.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PaymentMethodStats.prototype, "count", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PaymentMethodStats.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PaymentMethodStats.prototype, "percentage", void 0);
exports.PaymentMethodStats = PaymentMethodStats = __decorate([
    (0, mongoose_1.Schema)()
], PaymentMethodStats);
let Dashboard = class Dashboard {
};
exports.Dashboard = Dashboard;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Dashboard.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['daily', 'weekly', 'monthly', 'yearly'] }),
    __metadata("design:type", String)
], Dashboard.prototype, "period", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dashboard.prototype, "totalRevenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dashboard.prototype, "totalOrders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dashboard.prototype, "totalProfit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dashboard.prototype, "averageOrderValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductStats], default: [] }),
    __metadata("design:type", Array)
], Dashboard.prototype, "topSellingProducts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductStats], default: [] }),
    __metadata("design:type", Array)
], Dashboard.prototype, "mostViewedProducts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dashboard.prototype, "totalReturns", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dashboard.prototype, "returnRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Dashboard.prototype, "branchOverview", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PaymentMethodStats], default: [] }),
    __metadata("design:type", Array)
], Dashboard.prototype, "paymentMethods", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Dashboard.prototype, "lastUpdated", void 0);
exports.Dashboard = Dashboard = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Dashboard);
exports.DashboardStatsSchema = mongoose_1.SchemaFactory.createForClass(Dashboard);
//# sourceMappingURL=dashboard.schema.js.map