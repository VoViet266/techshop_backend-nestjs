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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("../dashboard/dashboard.service");
const publicDecorator_1 = require("../decorator/publicDecorator");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getStats(period, date) {
        if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
            throw new common_1.BadRequestException('Invalid period. Must be one of: daily, weekly, monthly, yearly');
        }
        const targetDate = date ? new Date(date) : new Date();
        if (date && isNaN(targetDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        return await this.dashboardService.getStatsWithComparison(period, targetDate);
    }
    async getCurrentStats(period, date) {
        if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
            throw new common_1.BadRequestException('Invalid period. Must be one of: daily, weekly, monthly, yearly');
        }
        const targetDate = date ? new Date(date) : new Date();
        if (date && isNaN(targetDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        return await this.dashboardService.getStats(period, targetDate);
    }
    async getHistoricalStats(period, limit, startDate, endDate) {
        if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
            throw new common_1.BadRequestException('Invalid period. Must be one of: daily, weekly, monthly, yearly');
        }
        const limitNum = limit ? parseInt(limit) : 30;
        if (limit && isNaN(limitNum)) {
            throw new common_1.BadRequestException('Invalid limit. Must be a number');
        }
        const stats = await this.dashboardService.getStatsByPeriod(period);
        let filteredStats = stats;
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date();
            if (startDate && isNaN(start.getTime())) {
                throw new common_1.BadRequestException('Invalid startDate format');
            }
            if (endDate && isNaN(end.getTime())) {
                throw new common_1.BadRequestException('Invalid endDate format');
            }
            filteredStats = stats.filter((stat) => {
                const statDate = new Date(stat.date);
                return statDate >= start && statDate <= end;
            });
        }
        return filteredStats
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limitNum);
    }
    async getStatsComparison(period, date) {
        if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
            throw new common_1.BadRequestException('Invalid period. Must be one of: daily, weekly, monthly, yearly');
        }
        const targetDate = date ? new Date(date) : new Date();
        if (date && isNaN(targetDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        return await this.dashboardService.getStatsWithComparison(period, targetDate);
    }
    async getTopSellingProducts(period = 'daily', limit, date) {
        const limitNum = limit ? parseInt(limit) : 5;
        const targetDate = date ? new Date(date) : new Date();
        const stats = await this.dashboardService.getStats(period, targetDate);
        if (!stats) {
            return [];
        }
        return stats.topSellingProducts.slice(0, limitNum);
    }
    async getMostViewedProducts(period = 'daily', limit, date) {
        const limitNum = limit ? parseInt(limit) : 5;
        const targetDate = date ? new Date(date) : new Date();
        const stats = await this.dashboardService.getStats(period, targetDate);
        if (!stats) {
            return [];
        }
        return stats.mostViewedProducts.slice(0, limitNum);
    }
    async getPaymentMethodStats(period = 'daily', date) {
        const targetDate = date ? new Date(date) : new Date();
        const stats = await this.dashboardService.getStats(period, targetDate);
        if (!stats) {
            return [];
        }
        return stats.paymentMethods;
    }
    async getDashboardOverview(period = 'daily', date) {
        const targetDate = date ? new Date(date) : new Date();
        const comparison = await this.dashboardService.getStatsWithComparison(period, targetDate);
        if (!comparison.current) {
            return {
                totalRevenue: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                returnRate: 0,
                revenueChange: 0,
                ordersChange: 0,
                aovChange: 0,
                returnRateChange: 0,
            };
        }
        return {
            totalRevenue: comparison.current.totalRevenue,
            totalOrders: comparison.current.totalOrders,
            averageOrderValue: comparison.current.averageOrderValue,
            returnRate: comparison.current.returnRate,
            revenueChange: comparison.comparison?.revenueChange || 0,
            ordersChange: comparison.comparison?.ordersChange || 0,
            aovChange: comparison.comparison?.aovChange || 0,
            returnRateChange: comparison.comparison?.returnRateChange || 0,
            lastUpdated: comparison.current.lastUpdated,
        };
    }
    async updateDailyStats() {
        await this.dashboardService.updateDailyStats();
        return {
            message: 'Daily stats updated successfully',
            timestamp: new Date(),
        };
    }
    async updateWeeklyStats() {
        await this.dashboardService.updateWeeklyStats();
        return {
            message: 'Weekly stats updated successfully',
            timestamp: new Date(),
        };
    }
    async updateMonthlyStats() {
        await this.dashboardService.updateMonthlyStats();
        return {
            message: 'Monthly stats updated successfully',
            timestamp: new Date(),
        };
    }
    async updateYearlyStats() {
        await this.dashboardService.updateYearlyStats();
        return {
            message: 'Yearly stats updated successfully',
            timestamp: new Date(),
        };
    }
    async updateAllStats() {
        await Promise.all([
            this.dashboardService.updateDailyStats(),
            this.dashboardService.updateWeeklyStats(),
            this.dashboardService.updateMonthlyStats(),
            this.dashboardService.updateYearlyStats(),
        ]);
        return {
            message: 'All stats updated successfully',
            timestamp: new Date(),
        };
    }
    async getCustomRangeStats(startDate, endDate, groupBy = 'daily') {
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('startDate and endDate are required');
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        if (start >= end) {
            throw new common_1.BadRequestException('startDate must be before endDate');
        }
        const stats = await this.dashboardService.getStatsByPeriod(groupBy);
        return stats
            .filter((stat) => {
            const statDate = new Date(stat.date);
            return statDate >= start && statDate <= end;
        })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    async healthCheck() {
        return {
            status: 'OK',
            timestamp: new Date(),
            service: 'Dashboard API',
        };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('/stats/:period'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Param)('period')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('/stats/:period/current'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Param)('period')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCurrentStats", null);
__decorate([
    (0, common_1.Get)('/stats/:period/historical'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Param)('period')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getHistoricalStats", null);
__decorate([
    (0, common_1.Get)('/stats/:period/comparison'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Param)('period')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStatsComparison", null);
__decorate([
    (0, common_1.Get)('/products/top-selling'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTopSellingProducts", null);
__decorate([
    (0, common_1.Get)('/products/most-viewed'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMostViewedProducts", null);
__decorate([
    (0, common_1.Get)('/payment-methods'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPaymentMethodStats", null);
__decorate([
    (0, common_1.Get)('/overview'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardOverview", null);
__decorate([
    (0, common_1.Post)('/update/daily'),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "updateDailyStats", null);
__decorate([
    (0, common_1.Post)('/update/weekly'),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "updateWeeklyStats", null);
__decorate([
    (0, common_1.Post)('/update/monthly'),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "updateMonthlyStats", null);
__decorate([
    (0, common_1.Post)('/update/yearly'),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "updateYearlyStats", null);
__decorate([
    (0, common_1.Post)('/update/all'),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "updateAllStats", null);
__decorate([
    (0, common_1.Get)('/stats/custom-range'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('groupBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCustomRangeStats", null);
__decorate([
    (0, common_1.Get)('/health'),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "healthCheck", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('api/v1/dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map