import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { OrderDocument } from 'src/order/schemas/order.schema';
import { ProductDocument } from 'src/product/schemas/product.schema';
import { Dashboard, DashboardDocument } from '../dashboard/schemas/dashboard.schema';
import { CreateDashboardStatsDto } from '../dashboard/dto/create-dashboard.dto';
import { BranchDocument } from 'src/branch/schemas/branch.schema';
import { InventoryDocument } from 'src/inventory/schemas/inventory.schema';
import { Types } from 'mongoose';
export declare class DashboardService {
    private dashboardModel;
    private readonly orderModel;
    private readonly productModel;
    private readonly branchModel;
    private readonly inventoryModel;
    private readonly logger;
    constructor(dashboardModel: SoftDeleteModel<DashboardDocument>, orderModel: SoftDeleteModel<OrderDocument>, productModel: SoftDeleteModel<ProductDocument>, branchModel: SoftDeleteModel<BranchDocument>, inventoryModel: SoftDeleteModel<InventoryDocument>);
    createOrUpdateStats(period: string, data: CreateDashboardStatsDto): Promise<Dashboard>;
    getStats(period: string, date?: Date): Promise<Dashboard>;
    getStatsByPeriod(period: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Dashboard> & Dashboard & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Dashboard> & Dashboard & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getStatsWithComparison(period: string, date?: Date): Promise<{
        current: Dashboard;
        previous: Dashboard;
        comparison: {
            revenueChange: number;
            ordersChange: number;
            profitChange: number;
            aovChange: number;
            returnRateChange: number;
            totalProfitChange: number;
        };
        profit: {
            revenueChange: number;
            ordersChange: number;
            profitChange: number;
            aovChange: number;
            returnRateChange: number;
            totalProfitChange: number;
        };
    }>;
    getBranchStats(period: string, date?: Date): Promise<any[]>;
    getBranchOverview(period: string, date?: Date): Promise<{
        branchStats: any[];
    }>;
    updateDailyStats(): Promise<void>;
    updateWeeklyStats(): Promise<void>;
    updateMonthlyStats(): Promise<void>;
    updateYearlyStats(): Promise<void>;
    private getDateKey;
    private getDateRange;
    private getPreviousDate;
    private calculateComparison;
    private calculatePercentageChange;
    private aggregateDataFromRange;
    private getEmptyStats;
    private aggregateDailyData;
    private aggregateWeeklyData;
    private aggregateMonthlyData;
    private aggregateYearlyData;
}
