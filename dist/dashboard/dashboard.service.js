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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const order_schema_1 = require("../order/schemas/order.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const dashboard_schema_1 = require("../dashboard/schemas/dashboard.schema");
const branch_schema_1 = require("../branch/schemas/branch.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
let DashboardService = DashboardService_1 = class DashboardService {
    constructor(dashboardModel, orderModel, productModel, branchModel, inventoryModel) {
        this.dashboardModel = dashboardModel;
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.branchModel = branchModel;
        this.inventoryModel = inventoryModel;
        this.logger = new common_1.Logger(DashboardService_1.name);
    }
    async createOrUpdateStats(period, data) {
        const today = new Date();
        const dateKey = this.getDateKey(today, period);
        const existingStats = await this.dashboardModel.findOne({
            date: dateKey,
            period: period,
        });
        if (existingStats) {
            return await this.dashboardModel.findByIdAndUpdate(existingStats._id, { ...data, lastUpdated: new Date() }, { new: true });
        }
        else {
            return await this.dashboardModel.create({
                ...data,
                date: dateKey,
                period: period,
                lastUpdated: new Date(),
            });
        }
    }
    async getStats(period, date) {
        const targetDate = date || new Date();
        const dateKey = this.getDateKey(targetDate, period);
        const stats = await this.dashboardModel.findOne({
            date: dateKey,
            period: period,
        });
        return stats;
    }
    async getStatsByPeriod(period) {
        const stats = await this.dashboardModel.find({ period: period }).sort({
            date: -1,
        });
        return stats;
    }
    async getStatsWithComparison(period, date) {
        const targetDate = date || new Date();
        const currentStats = await this.getStats(period, targetDate);
        const previousDate = this.getPreviousDate(targetDate, period);
        const previousStats = await this.getStats(period, previousDate);
        return {
            current: currentStats,
            previous: previousStats,
            comparison: this.calculateComparison(currentStats, previousStats),
            profit: this.calculateComparison(currentStats, previousStats),
        };
    }
    async getBranchStats(period, date) {
        const { start, end } = this.getDateRange(period, date);
        return this.orderModel.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.branch',
                    totalRevenue: {
                        $sum: { $multiply: ['$items.quantity', '$items.price'] },
                    },
                    totalOrders: { $addToSet: '$_id' },
                    customers: { $addToSet: '$user' },
                    products: {
                        $push: {
                            productId: '$items.product',
                            quantity: '$items.quantity',
                            price: '$items.price',
                            revenue: { $multiply: ['$items.quantity', '$items.price'] },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'branches',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'branchInfo',
                },
            },
            { $unwind: '$branchInfo' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            {
                $project: {
                    branchId: '$_id',
                    branchName: '$branchInfo.name',
                    totalRevenue: 1,
                    totalOrders: { $size: '$totalOrders' },
                    averageOrderValue: {
                        $cond: {
                            if: { $gt: [{ $size: '$totalOrders' }, 0] },
                            then: { $divide: ['$totalRevenue', { $size: '$totalOrders' }] },
                            else: 0,
                        },
                    },
                },
            },
            { $sort: { totalRevenue: -1 } },
        ]);
    }
    async getBranchOverview(period, date) {
        const currentBranchStats = await this.getBranchStats(period, date);
        const totalBranches = await this.branchModel.countDocuments();
        return {
            totalBranches,
            branchStats: currentBranchStats,
        };
    }
    async getBranchDetailStats(branchId, period, date) {
        const { start, end } = this.getDateRange(period, date);
        const branchStats = await this.orderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lt: end },
                    'items.branch': branchId,
                },
            },
            { $unwind: '$items' },
            { $match: { 'items.branch': branchId } },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: { $multiply: ['$items.quantity', '$items.price'] },
                    },
                    totalOrders: { $addToSet: '$_id' },
                    customers: { $addToSet: '$user' },
                    products: {
                        $push: {
                            productId: '$items.product',
                            quantity: '$items.quantity',
                            price: '$items.price',
                            revenue: { $multiply: ['$items.quantity', '$items.price'] },
                        },
                    },
                    hourlyData: {
                        $push: {
                            hour: { $hour: '$createdAt' },
                            revenue: { $multiply: ['$items.quantity', '$items.price'] },
                            orderId: '$_id',
                        },
                    },
                },
            },
            {
                $project: {
                    totalRevenue: 1,
                    totalOrders: { $size: '$totalOrders' },
                    totalCustomers: { $size: '$customers' },
                    averageOrderValue: {
                        $cond: {
                            if: { $gt: [{ $size: '$totalOrders' }, 0] },
                            then: { $divide: ['$totalRevenue', { $size: '$totalOrders' }] },
                            else: 0,
                        },
                    },
                    products: 1,
                    hourlyData: 1,
                },
            },
        ]);
        const branchInfo = await this.branchModel.findById(branchId);
        return {
            branchInfo,
            stats: branchStats[0] || {
                totalRevenue: 0,
                totalOrders: 0,
                totalCustomers: 0,
                averageOrderValue: 0,
                products: [],
                hourlyData: [],
            },
        };
    }
    async updateDailyStats() {
        this.logger.log('Updating daily stats...');
        const dailyData = await this.aggregateDailyData();
        const result = await this.createOrUpdateStats('daily', dailyData);
        this.logger.log('Daily stats updated successfully');
    }
    async updateWeeklyStats() {
        this.logger.log('Updating weekly stats...');
        const weeklyData = await this.aggregateWeeklyData();
        await this.createOrUpdateStats('weekly', weeklyData);
        this.logger.log('Weekly stats updated successfully');
    }
    async updateMonthlyStats() {
        this.logger.log('Updating monthly stats...');
        const monthlyData = await this.aggregateMonthlyData();
        await this.createOrUpdateStats('monthly', monthlyData);
        this.logger.log('Monthly stats updated successfully');
    }
    async updateYearlyStats() {
        this.logger.log('Updating yearly stats...');
        const yearlyData = await this.aggregateYearlyData();
        await this.createOrUpdateStats('yearly', yearlyData);
        this.logger.log('Yearly stats updated successfully');
    }
    getDateKey(date, period) {
        const d = new Date(date);
        switch (period) {
            case 'daily':
                return new Date(d.getFullYear(), d.getMonth(), d.getDate());
            case 'weekly':
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - d.getDay());
                return new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
            case 'monthly':
                return new Date(d.getFullYear(), d.getMonth(), 1);
            case 'yearly':
                return new Date(d.getFullYear(), 0, 1);
            default:
                return d;
        }
    }
    getDateRange(period, date) {
        const targetDate = date || new Date();
        let start;
        let end;
        switch (period) {
            case 'daily':
                start = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
                end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
                break;
            case 'weekly':
                start = new Date(targetDate);
                start.setDate(targetDate.getDate() - targetDate.getDay());
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(start.getDate() + 7);
                break;
            case 'monthly':
                start = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                end = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);
                break;
            case 'yearly':
                start = new Date(targetDate.getFullYear(), 0, 1);
                end = new Date(targetDate.getFullYear() + 1, 0, 1);
                break;
            default:
                start = new Date(0);
                end = new Date();
        }
        return { start, end };
    }
    getPreviousDate(date, period) {
        const d = new Date(date);
        switch (period) {
            case 'daily':
                d.setDate(d.getDate() - 1);
                break;
            case 'weekly':
                d.setDate(d.getDate() - 7);
                break;
            case 'monthly':
                d.setMonth(d.getMonth() - 1);
                break;
            case 'yearly':
                d.setFullYear(d.getFullYear() - 1);
                break;
        }
        return d;
    }
    calculateComparison(current, previous) {
        if (!current || !previous)
            return null;
        return {
            revenueChange: this.calculatePercentageChange(current.totalRevenue, previous.totalRevenue),
            ordersChange: this.calculatePercentageChange(current.totalOrders, previous.totalOrders),
            aovChange: this.calculatePercentageChange(current.averageOrderValue, previous.averageOrderValue),
            returnRateChange: this.calculatePercentageChange(current.returnRate, previous.returnRate),
            totalProfitChange: this.calculatePercentageChange(current.totalProfit, previous.totalProfit),
        };
    }
    calculatePercentageChange(current, previous) {
        if (previous === 0)
            return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }
    async aggregateDataFromRange(start, end) {
        const orders = await this.orderModel.find({
            createdAt: { $gte: start, $lt: end },
        });
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const allVariantIds = orders.flatMap((order) => order.items.map((item) => item.variant.toString()));
        const inventories = await this.inventoryModel
            .find({
            'variants.variantId': { $in: allVariantIds },
            isDeleted: false,
        })
            .lean();
        const variantCostMap = new Map();
        for (const inv of inventories) {
            for (const v of inv.variants) {
                variantCostMap.set(v.variantId.toString(), v.cost);
            }
        }
        const productStatsMap = {};
        let totalProfit = 0;
        for (const order of orders) {
            for (const item of order.items) {
                const productId = item.product.toString();
                if (!productStatsMap[productId]) {
                    const product = await this.productModel.findById(productId).lean();
                    if (!product)
                        continue;
                    productStatsMap[productId] = {
                        productName: product.name,
                        soldCount: 0,
                        viewCount: 0,
                        revenue: 0,
                    };
                }
                productStatsMap[productId].soldCount += item.quantity;
                productStatsMap[productId].viewCount += item.quantity;
                productStatsMap[productId].revenue += item.quantity * item.price;
                const cost = variantCostMap.get(item.variant.toString()) || 0;
                const profit = (item.price - cost) * item.quantity;
                totalProfit += profit;
            }
        }
        const topSellingProducts = Object.entries(productStatsMap)
            .sort((a, b) => b[1].soldCount - a[1].soldCount)
            .slice(0, 5)
            .map(([productId, stats]) => ({
            productId,
            productName: stats.productName,
            soldCount: stats.soldCount,
            revenue: stats.revenue,
        }));
        const mostViewedProducts = Object.entries(productStatsMap)
            .sort((a, b) => b[1].viewCount - a[1].viewCount)
            .slice(0, 5)
            .map(([productId, stats]) => ({
            productId,
            productName: stats.productName,
            viewCount: stats.viewCount,
            revenue: stats.revenue,
        }));
        const paymentStats = orders.reduce((acc, order) => {
            const method = order.paymentMethod || 'unknown';
            if (!acc[method]) {
                acc[method] = { count: 0, amount: 0 };
            }
            acc[method].count += 1;
            acc[method].amount += order.totalPrice;
            return acc;
        }, {});
        const paymentMethods = Object.entries(paymentStats).map(([method, data]) => ({
            method,
            count: data.count,
            amount: data.amount,
            percentage: totalRevenue ? (data.amount / totalRevenue) * 100 : 0,
        }));
        const branchOverview = await this.getBranchOverview('daily', start);
        return {
            date: start,
            period: 'daily',
            totalRevenue,
            totalProfit,
            totalOrders,
            averageOrderValue,
            topSellingProducts,
            mostViewedProducts,
            totalReturns: 0,
            paymentMethods,
            branchOverview,
        };
    }
    async aggregateDailyData() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
        const data = await this.aggregateDataFromRange(startOfDay, endOfDay);
        console.log('data: ', data);
        return {
            ...data,
            period: 'daily',
            date: startOfDay,
        };
    }
    async aggregateWeeklyData() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        const data = await this.aggregateDataFromRange(startOfWeek, endOfWeek);
        return {
            ...data,
            period: 'weekly',
            date: startOfWeek,
        };
    }
    async aggregateMonthlyData() {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const data = await this.aggregateDataFromRange(startOfMonth, endOfMonth);
        return {
            ...data,
            period: 'monthly',
            date: startOfMonth,
        };
    }
    async aggregateYearlyData() {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
        const data = await this.aggregateDataFromRange(startOfYear, endOfYear);
        return {
            ...data,
            period: 'yearly',
            date: startOfYear,
        };
    }
};
exports.DashboardService = DashboardService;
__decorate([
    (0, schedule_1.Cron)('*/1 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardService.prototype, "updateDailyStats", null);
__decorate([
    (0, schedule_1.Cron)('*/2 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardService.prototype, "updateWeeklyStats", null);
__decorate([
    (0, schedule_1.Cron)('*/2 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardService.prototype, "updateMonthlyStats", null);
__decorate([
    (0, schedule_1.Cron)('*/2 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardService.prototype, "updateYearlyStats", null);
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dashboard_schema_1.Dashboard.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Products.name)),
    __param(3, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __param(4, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map