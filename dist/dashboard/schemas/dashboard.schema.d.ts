import { HydratedDocument } from 'mongoose';
export type DashboardDocument = HydratedDocument<Dashboard>;
export declare class ProductStats {
    productId: string;
    productName: string;
    soldCount?: number;
    revenue?: number;
    viewCount?: number;
}
export declare class PaymentMethodStats {
    method: string;
    count: number;
    amount: number;
    percentage: number;
}
export declare class Dashboard {
    date: Date;
    period: string;
    totalRevenue: number;
    totalOrders: number;
    totalProfit: number;
    averageOrderValue: number;
    topSellingProducts: ProductStats[];
    mostViewedProducts: ProductStats[];
    totalReturns: number;
    returnRate: number;
    branchOverview: any;
    paymentMethods: PaymentMethodStats[];
    lastUpdated: Date;
}
export declare const DashboardStatsSchema: import("mongoose").Schema<Dashboard, import("mongoose").Model<Dashboard, any, any, any, import("mongoose").Document<unknown, any, Dashboard> & Dashboard & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Dashboard, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Dashboard>> & import("mongoose").FlatRecord<Dashboard> & {
    _id: import("mongoose").Types.ObjectId;
}>;
