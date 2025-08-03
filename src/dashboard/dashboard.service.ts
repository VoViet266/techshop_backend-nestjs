import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';
import { Products, ProductDocument } from 'src/product/schemas/product.schema';
import {
  Dashboard,
  DashboardDocument,
} from '../dashboard/schemas/dashboard.schema';
import { CreateDashboardStatsDto } from '../dashboard/dto/create-dashboard.dto';
import { Branch, BranchDocument } from 'src/branch/schemas/branch.schema';
import {
  Inventory,
  InventoryDocument,
} from 'src/inventory/schemas/inventory.schema';
import { PaymentStatus } from 'src/constant/payment.enum';
import { OrderStatus } from 'src/constant/orderStatus.enum';
import { Types } from 'mongoose';

// Interface cho branch stats
interface BranchStats {
  branchId: string;
  branchName: string;
  address: string;
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  totalProfit: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    soldCount: number;
    revenue: number;
  }>;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel(Dashboard.name)
    private dashboardModel: SoftDeleteModel<DashboardDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(Branch.name)
    private readonly branchModel: SoftDeleteModel<BranchDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<InventoryDocument>,
  ) {}

  // Tạo hoặc cập nhật stats
  async createOrUpdateStats(
    period: string,
    data: CreateDashboardStatsDto,
  ): Promise<Dashboard> {
    const today = new Date();
    const dateKey = this.getDateKey(today, period);
    const existingStats = await this.dashboardModel.findOne({
      date: dateKey,
      period: period,
    });

    if (existingStats) {
      return await this.dashboardModel.findByIdAndUpdate(
        existingStats._id,
        { ...data, lastUpdated: new Date() },
        { new: true },
      );
    } else {
      return await this.dashboardModel.create({
        ...data,
        date: dateKey,
        period: period,
        lastUpdated: new Date(),
      });
    }
  }

  async getStats(period: string, date?: Date): Promise<Dashboard> {
    try {
      const targetDate = date || new Date();
      const dateKey = this.getDateKey(targetDate, period);

      const stats = await this.dashboardModel.findOne({
        date: dateKey,
        period: period,
      });

      return stats;
    } catch (error) {
      this.logger.error(`Error getting stats for ${period}:`, error);
      throw error;
    }
  }

  async getStatsByPeriod(period: string) {
    try {
      const stats = await this.dashboardModel
        .find({ period: period })
        .sort({ date: -1 });
      return stats;
    } catch (error) {
      this.logger.error(`Error getting stats by period ${period}:`, error);
      throw error;
    }
  }

  // Lấy stats với so sánh kỳ trước
  async getStatsWithComparison(period: string, date?: Date) {
    try {
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
    } catch (error) {
      this.logger.error(
        `Error getting stats with comparison for ${period}:`,
        error,
      );
      throw error;
    }
  }

  async getBranchStats(period: string, date?: Date) {
    try {
      const { start, end } = this.getDateRange(period, date);

      const result = await this.orderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lt: end },
          },
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'inventories',
            let: { variantId: '$items.variant' },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$$variantId', '$variants.variantId'] },
                  isDeleted: false,
                },
              },
              { $unwind: '$variants' },
              {
                $match: {
                  $expr: { $eq: ['$variants.variantId', '$$variantId'] },
                },
              },
              { $project: { cost: '$variants.cost', _id: 0 } },
            ],
            as: 'variantCost',
          },
        },
        {
          $addFields: {
            itemCost: {
              $ifNull: [{ $arrayElemAt: ['$variantCost.cost', 0] }, 0],
            },
          },
        },
        // Gom nhóm theo branch, tính doanh thu & lợi nhuận
        {
          $group: {
            _id: '$items.branch',
            totalRevenue: {
              $sum: { $multiply: ['$items.quantity', '$items.price'] },
            },
            totalProfit: {
              $sum: {
                $multiply: [
                  '$items.quantity',
                  { $subtract: ['$items.price', '$itemCost'] },
                ],
              },
            },
            totalOrders: { $addToSet: '$_id' },
            customers: { $addToSet: '$user' },
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
        { $unwind: { path: '$branchInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            branchId: '$_id',
            branchName: { $ifNull: ['$branchInfo.name', 'Unknown Branch'] },
            totalRevenue: 1,
            totalProfit: 1,
            totalOrders: { $size: '$totalOrders' },
            totalCustomers: { $size: '$customers' },
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

      return result;
    } catch (error) {
      this.logger.error(`Error getting branch stats for ${period}:`, error);
      throw error;
    }
  }

  // Lấy tổng quan branch với so sánh kỳ trước
  async getBranchOverview(period: string, date?: Date) {
    try {
      const currentBranchStats = await this.getBranchStats(period, date);
      return {
        branchStats: currentBranchStats,
      };
    } catch (error) {
      this.logger.error(`Error getting branch overview for ${period}:`, error);
      throw error;
    }
  }

  // Cron job - Cập nhật stats hóa đơn trong ngày
  // @Cron('0 0 * * *') // Mỗi ngày lúc 0h
  @Cron('*/2 * * * *') // Test: Mỗi 2 phút
  async updateDailyStats() {
    try {
      this.logger.log('Updating daily stats...');
      const dailyData = await this.aggregateDailyData();
      await this.createOrUpdateStats('daily', dailyData);
      this.logger.log('Daily stats updated successfully');
    } catch (error) {
      this.logger.error('Error updating daily stats:', error);
    }
    this.logger.log('Updating daily stats...');
    const dailyData = await this.aggregateDailyData();
    const result = await this.createOrUpdateStats('daily', dailyData);
    this.logger.log('Daily stats updated successfully');
  }

  // Cron job - Cập nhật stats hàng tuần vào Thứ Hai
  @Cron('0 0 * * 1') // 0h Thứ 2
  // @Cron('*/2 * * * *') // Test: Mỗi 2 phút
  async updateWeeklyStats() {
    try {
      this.logger.log('Updating weekly stats...');
      const weeklyData = await this.aggregateWeeklyData();
      await this.createOrUpdateStats('weekly', weeklyData);
      this.logger.log('Weekly stats updated successfully');
    } catch (error) {
      this.logger.error('Error updating weekly stats:', error);
    }
  }

  // Cron job - Cập nhật stats hàng tháng vào ngày 1
  @Cron('0 0 1 * *') // 0h ngày 1 mỗi tháng
  // @Cron('*/2 * * * *') // Test: Mỗi 2 phút
  async updateMonthlyStats() {
    try {
      this.logger.log('Updating monthly stats...');
      const monthlyData = await this.aggregateMonthlyData();
      await this.createOrUpdateStats('monthly', monthlyData);
      this.logger.log('Monthly stats updated successfully');
    } catch (error) {
      this.logger.error('Error updating monthly stats:', error);
    }
  }

  // Cron job - Cập nhật stats hàng năm vào 1/1
  @Cron('0 0 1 1 *') // 0h ngày 1 tháng 1
  // @Cron('*/2 * * * *') // Test: Mỗi 2 phút
  async updateYearlyStats() {
    try {
      this.logger.log('Updating yearly stats...');
      const yearlyData = await this.aggregateYearlyData();
      await this.createOrUpdateStats('yearly', yearlyData);
      this.logger.log('Yearly stats updated successfully');
    } catch (error) {
      this.logger.error('Error updating yearly stats:', error);
    }
  }

  // Helper methods
  private getDateKey(date: Date, period: string): Date {
    const d = new Date(date);
    switch (period) {
      case 'daily':
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      case 'weekly':
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return new Date(
          weekStart.getFullYear(),
          weekStart.getMonth(),
          weekStart.getDate(),
        );
      case 'monthly':
        return new Date(d.getFullYear(), d.getMonth(), 1);
      case 'yearly':
        return new Date(d.getFullYear(), 0, 1);
      default:
        return d;
    }
  }

  private getDateRange(
    period: string,
    date?: Date,
  ): { start: Date; end: Date } {
    const targetDate = date || new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case 'daily':
        start = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate(),
        );
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

  private getPreviousDate(date: Date, period: string): Date {
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

  private calculateComparison(current: Dashboard, previous: Dashboard) {
    if (!current || !previous) return null;

    return {
      revenueChange: this.calculatePercentageChange(
        current.totalRevenue,
        previous.totalRevenue,
      ),
      ordersChange: this.calculatePercentageChange(
        current.totalOrders,
        previous.totalOrders,
      ),
      profitChange: this.calculatePercentageChange(
        current.totalProfit || 0,
        previous.totalProfit || 0,
      ),
      aovChange: this.calculatePercentageChange(
        current.averageOrderValue,
        previous.averageOrderValue,
      ),
      returnRateChange: this.calculatePercentageChange(
        current.returnRate || 0,
        previous.returnRate || 0,
      ),
      totalProfitChange: this.calculatePercentageChange(
        current.totalProfit,
        previous.totalProfit,
      ),
    };
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (!current) current = 0;
    if (!previous) previous = 0;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  private async aggregateDataFromRange(
    start: Date,
    end: Date,
    period: string,
  ): Promise<CreateDashboardStatsDto> {
    try {
      // Tối ưu query với populate có điều kiện
      const orders = await this.orderModel
        .find({
          createdAt: { $gte: start, $lt: end },
        })
        .lean();

      if (!orders || orders.length === 0) {
        return this.getEmptyStats(start, period);
      }

      const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0,
      );
      const totalOrders = orders.length;
      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Gom tất cả variantId từ orders
      const allVariantIds = orders.flatMap((order) =>
        (order.items || [])
          .map((item) => item.variant?.toString())
          .filter(Boolean),
      );

      // Lấy inventory 1 lần cho tất cả variantId
      const inventories = await this.inventoryModel
        .find({
          'variants.variantId': { $in: allVariantIds },
          isDeleted: false,
        })
        .lean();

      // Map variantId -> cost
      const variantCostMap = new Map<string, number>();
      for (const inv of inventories) {
        for (const v of inv.variants || []) {
          if (v.variantId) {
            variantCostMap.set(v.variantId.toString(), v.cost || 0);
          }
        }
      }

      // Map thống kê sản phẩm
      const productStatsMap: Record<
        string,
        {
          productName: string;
          soldCount: number;
          viewCount: number;
          revenue: number;
        }
      > = {};

      let totalProfit: number = 0;

      const productCache = new Map<string, any>();

      // Duyệt qua orders để tính thống kê
      for (const order of orders) {
        if (!order.items || !Array.isArray(order.items)) continue;

        for (const item of order.items) {
          if (!item.product || !item.variant) continue;

          const productId = item.product.toString();

          // Lấy product từ cache hoặc DB
          let product = productCache.get(productId);
          if (!product) {
            product = await this.productModel.findById(productId).lean();
            if (product) {
              productCache.set(productId, product);
            }
          }

          if (!product) continue;

          // Nếu product chưa có trong map thì khởi tạo
          if (!productStatsMap[productId]) {
            productStatsMap[productId] = {
              productName: product.name || 'Unknown Product',
              soldCount: 0,
              viewCount: 0,
              revenue: 0,
            };
          }

          const quantity = item.quantity || 0;
          const price = item.price || 0;

          // Cập nhật số lượng, view, revenue
          productStatsMap[productId].soldCount += quantity;
          productStatsMap[productId].viewCount += quantity;
          productStatsMap[productId].revenue += quantity * price;

          // Lấy cost từ map (nếu không có cost, coi là 0)
          const cost = variantCostMap.get(item.variant.toString()) || 0;

          // Tính profit cho item
          const profit = (price - cost) * quantity;

          // Cộng profit vào tổng
          totalProfit += profit;
        }
      }

      // Lấy top 5 sản phẩm bán chạy
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

      // Tính payment method stats
      const paymentStats = orders.reduce(
        (acc, order) => {
          const method = order.paymentMethod || 'unknown';
          if (!acc[method]) {
            acc[method] = { count: 0, amount: 0 };
          }
          acc[method].count += 1;
          acc[method].amount += order.totalPrice || 0;
          return acc;
        },
        {} as Record<string, { count: number; amount: number }>,
      );

      const paymentMethods = Object.entries(paymentStats).map(
        ([method, data]) => ({
          method,
          count: data.count,
          amount: data.amount,
          percentage: totalRevenue ? (data.amount / totalRevenue) * 100 : 0,
        }),
      );

      const branchOverview = await this.getBranchOverview(period, start);

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
    } catch (error) {
      this.logger.error('Error aggregating data from range:', error);
      throw error;
    }
  }

  private getEmptyStats(date: Date, period: string): CreateDashboardStatsDto {
    return {
      date,
      period: 'daily',
      totalRevenue: 0,
      totalProfit: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      topSellingProducts: [],
      mostViewedProducts: [],
      totalReturns: 0,
      paymentMethods: [],
      branchOverview: { branchStats: [{}] },
    };
  }

  private async aggregateDailyData(): Promise<CreateDashboardStatsDto> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    return await this.aggregateDataFromRange(startOfDay, endOfDay, 'daily');
    const data = await this.aggregateDataFromRange(startOfDay, endOfDay);
    return {
      ...data,
      period: 'daily',
      date: startOfDay,
    };
  }

  private async aggregateWeeklyData(): Promise<CreateDashboardStatsDto> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return await this.aggregateDataFromRange(startOfWeek, endOfWeek, 'weekly');
  }

  private async aggregateMonthlyData(): Promise<CreateDashboardStatsDto> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    return await this.aggregateDataFromRange(
      startOfMonth,
      endOfMonth,
      'monthly',
    );
  }

  private async aggregateYearlyData(): Promise<CreateDashboardStatsDto> {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear() + 1, 0, 1);

    return await this.aggregateDataFromRange(startOfYear, endOfYear, 'yearly');
  }
}
