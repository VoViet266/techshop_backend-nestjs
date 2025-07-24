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
    const targetDate = date || new Date();

    const dateKey = this.getDateKey(targetDate, period);

    const stats = await this.dashboardModel.findOne({
      date: dateKey,
      period: period,
    });

    return stats;
  }

  async getStatsByPeriod(period: string) {
    const stats = await this.dashboardModel.find({ period: period }).sort({
      date: -1,
    });
    return stats;
  }

  // Lấy stats với so sánh kỳ trước
  async getStatsWithComparison(period: string, date?: Date) {
    const targetDate = date || new Date();
    const currentStats = await this.getStats(period, targetDate);

    const previousDate = this.getPreviousDate(targetDate, period);
    const previousStats = await this.getStats(period, previousDate);

    return {
      current: currentStats,
      previous: previousStats,
      comparison: this.calculateComparison(currentStats, previousStats),
    };
  }

  // Cron job - Cập nhật stats hóa đơn trong ngày
  // @Cron('0 0 * * *') // Mỗi ngày lúc 0h
  @Cron('*/2 * * * *')
  async updateDailyStats() {
    this.logger.log('Updating daily stats...');
    const dailyData = await this.aggregateDailyData();
    await this.createOrUpdateStats('daily', dailyData);
    this.logger.log('Daily stats updated successfully');
  }

  // Cron job - Cập nhật stats hàng tuần vào Thứ Hai
  // @Cron('0 0 * * 1') // 0h Thứ 2
  @Cron('*/2 * * * *')
  async updateWeeklyStats() {
    this.logger.log('Updating weekly stats...');
    const weeklyData = await this.aggregateWeeklyData();
    await this.createOrUpdateStats('weekly', weeklyData);
    this.logger.log('Weekly stats updated successfully');
  }

  // Cron job - Cập nhật stats hàng tháng vào ngày 1
  // @Cron('0 0 1 * *') // 0h ngày 1 mỗi tháng
  @Cron('*/2 * * * *')
  async updateMonthlyStats() {
    this.logger.log('Updating monthly stats...');
    const monthlyData = await this.aggregateMonthlyData();
    await this.createOrUpdateStats('monthly', monthlyData);
    this.logger.log('Monthly stats updated successfully');
  }

  // Cron job - Cập nhật stats hàng năm vào 1/1
  // @Cron('0 0 1 1 *') // 0h ngày 1 tháng 1
  @Cron('*/2 * * * *') //
  async updateYearlyStats() {
    this.logger.log('Updating yearly stats...');
    const yearlyData = await this.aggregateYearlyData();
    await this.createOrUpdateStats('yearly', yearlyData);
    this.logger.log('Yearly stats updated successfully');
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
      aovChange: this.calculatePercentageChange(
        current.averageOrderValue,
        previous.averageOrderValue,
      ),
      returnRateChange: this.calculatePercentageChange(
        current.returnRate,
        previous.returnRate,
      ),
    };
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
  private async aggregateDataFromRange(
    start: Date,
    end: Date,
  ): Promise<CreateDashboardStatsDto> {
    const orders = await this.orderModel.find({
      createdAt: { $gte: start, $lt: end },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // === Tổng hợp dữ liệu bán ra, doanh thu, lượt xem ===
    const productStatsMap: Record<
      string,
      {
        productName: string;
        soldCount: number;
        viewCount: number;
        revenue: number;
      }
    > = {};

    for (const order of orders) {
      for (const item of order.items) {
        const productId = item.product.toString();
        if (!productStatsMap[productId]) {
          const product = await this.productModel.findById(productId).lean();
          if (!product) continue;

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
      }
    }

    // Lấy top 5 sản phẩm bán chạy theo soldCount
    const topSellingProducts = Object.entries(productStatsMap)
      .sort((a, b) => b[1].soldCount - a[1].soldCount)
      .slice(0, 5)
      .map(([productId, stats]) => ({
        productId,
        productName: stats.productName,
        soldCount: stats.soldCount,
        revenue: stats.revenue,
      }));

    // Lấy top 5 sản phẩm được xem nhiều nhất trong khoảng thời gian
    const mostViewedProducts = Object.entries(productStatsMap)
      .sort((a, b) => b[1].viewCount - a[1].viewCount)
      .slice(0, 5)
      .map(([productId, stats]) => ({
        productId,
        productName: stats.productName,
        viewCount: stats.viewCount,
        revenue: stats.revenue,
      }));

    // Phân tích phương thức thanh toán
    const paymentStats = orders.reduce(
      (acc, order) => {
        const method = order.paymentMethod || 'unknown';
        if (!acc[method]) {
          acc[method] = { count: 0, amount: 0 };
        }
        acc[method].count += 1;
        acc[method].amount += order.totalPrice;
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

    return {
      date: start,
      period: 'daily',
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topSellingProducts,
      mostViewedProducts,
      totalReturns: 0,
      returnRate: 0,
      paymentMethods,
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

    const data = await this.aggregateDataFromRange(startOfWeek, endOfWeek);
    return {
      ...data,
      period: 'weekly',
      date: startOfWeek,
    };
  }

  private async aggregateMonthlyData(): Promise<CreateDashboardStatsDto> {
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

  private async aggregateYearlyData(): Promise<CreateDashboardStatsDto> {
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

  // Manual update methods
  // async updateProductViews(productId: string): Promise<void> {
  //   const today = new Date();
  //   const dailyStats = await this.getStats('daily', today);

  //   if (dailyStats) {
  //     const product = dailyStats.mostViewedProducts.find(
  //       (p) => p.productId === productId,
  //     );
  //     if (product) {
  //       product.views += 1;
  //     }
  //     await dailyStats.save();
  //   }
  // }

  // async updateStockLevel(productId: string, newStock: number): Promise<void> {
  //   const today = new Date();
  //   const dailyStats = await this.getStats('daily', today);

  //   if (dailyStats) {
  //     const product = dailyStats.lowStockProducts.find(
  //       (p) => p.productId === productId,
  //     );
  //     if (product) {
  //       product.stockLevel = newStock;
  //     }
  //     await dailyStats.save();
  //   }
  // }
}
