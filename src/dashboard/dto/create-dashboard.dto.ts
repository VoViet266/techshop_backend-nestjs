import { PaymentMethodStats, ProductStats } from '../schemas/dashboard.schema';

export class CreateDashboardStatsDto {
  date: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  totalRevenue?: number;
  totalProfit: number;
  totalOrders?: number;
  averageOrderValue?: number;
  topSellingProducts?: ProductStats[];
  mostViewedProducts?: ProductStats[];
  totalReturns?: number;
  returnRate?: number;
  paymentMethods?: PaymentMethodStats[];
  branchOverview: any;
}

export class UpdateDashboardStatsDto {
  totalRevenue?: number;
  totalOrders?: number;
  totalProfit: number;
  averageOrderValue?: number;
  topSellingProducts?: ProductStats[];
  mostViewedProducts?: ProductStats[];
  lowStockProducts?: ProductStats[];
  totalReturns?: number;
  returnRate?: number;
  paymentMethods?: PaymentMethodStats[];
  branchOverview?: any;
}
