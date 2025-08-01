import { DashboardService } from '../dashboard/dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(period: string, date?: string): Promise<{
        current: import("./schemas/dashboard.schema").Dashboard;
        previous: import("./schemas/dashboard.schema").Dashboard;
        comparison: {
            revenueChange: number;
            ordersChange: number;
            aovChange: number;
            returnRateChange: number;
            totalProfitChange: number;
        };
        profit: {
            revenueChange: number;
            ordersChange: number;
            aovChange: number;
            returnRateChange: number;
            totalProfitChange: number;
        };
    }>;
    getCurrentStats(period: string, date?: string): Promise<import("./schemas/dashboard.schema").Dashboard>;
    getHistoricalStats(period: string, limit?: string, startDate?: string, endDate?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/dashboard.schema").Dashboard> & import("./schemas/dashboard.schema").Dashboard & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/dashboard.schema").Dashboard> & import("./schemas/dashboard.schema").Dashboard & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getStatsComparison(period: string, date?: string): Promise<{
        current: import("./schemas/dashboard.schema").Dashboard;
        previous: import("./schemas/dashboard.schema").Dashboard;
        comparison: {
            revenueChange: number;
            ordersChange: number;
            aovChange: number;
            returnRateChange: number;
            totalProfitChange: number;
        };
        profit: {
            revenueChange: number;
            ordersChange: number;
            aovChange: number;
            returnRateChange: number;
            totalProfitChange: number;
        };
    }>;
    getTopSellingProducts(period?: string, limit?: string, date?: string): Promise<import("./schemas/dashboard.schema").ProductStats[]>;
    getMostViewedProducts(period?: string, limit?: string, date?: string): Promise<import("./schemas/dashboard.schema").ProductStats[]>;
    getPaymentMethodStats(period?: string, date?: string): Promise<import("./schemas/dashboard.schema").PaymentMethodStats[]>;
    getDashboardOverview(period?: string, date?: string): Promise<{
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        returnRate: number;
        revenueChange: number;
        ordersChange: number;
        aovChange: number;
        returnRateChange: number;
        lastUpdated?: undefined;
    } | {
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        returnRate: number;
        revenueChange: number;
        ordersChange: number;
        aovChange: number;
        returnRateChange: number;
        lastUpdated: Date;
    }>;
    updateDailyStats(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    updateWeeklyStats(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    updateMonthlyStats(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    updateYearlyStats(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    updateAllStats(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    getCustomRangeStats(startDate: string, endDate: string, groupBy?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/dashboard.schema").Dashboard> & import("./schemas/dashboard.schema").Dashboard & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/dashboard.schema").Dashboard> & import("./schemas/dashboard.schema").Dashboard & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    healthCheck(): Promise<{
        status: string;
        timestamp: Date;
        service: string;
    }>;
}
