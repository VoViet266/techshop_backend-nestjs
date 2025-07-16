import { Controller, Get, Query, Param, BadRequestException, Post } from '@nestjs/common';
import { DashboardService } from '../dashboard/dashboard.service';
import { Public } from 'src/decorator/publicDecorator';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Lấy stats với so sánh kỳ trước
  @Get('/stats/:period')
  @Public()
  async getStats(
    @Param('period') period: string,
    @Query('date') date?: string,
  ) {
    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
      throw new BadRequestException(
        'Invalid period. Must be one of: daily, weekly, monthly, yearly',
      );
    }

    const targetDate = date ? new Date(date) : new Date();

    if (date && isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return await this.dashboardService.getStatsWithComparison(
      period,
      targetDate,
    );
  }

  @Get('/stats/:period/current')
  @Public()
  async getCurrentStats(
    @Param('period') period: string,
    @Query('date') date?: string,
  ) {
    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
      throw new BadRequestException(
        'Invalid period. Must be one of: daily, weekly, monthly, yearly',
      );
    }

    const targetDate = date ? new Date(date) : new Date();

    if (date && isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return await this.dashboardService.getStats(period, targetDate);
  }

  // Lấy dữ liệu lịch sử theo period (cho biểu đồ)
  @Get('/stats/:period/historical')
  @Public()
  async getHistoricalStats(
    @Param('period') period: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
      throw new BadRequestException(
        'Invalid period. Must be one of: daily, weekly, monthly, yearly',
      );
    }

    const limitNum = limit ? parseInt(limit) : 30; // Default 30 records

    if (limit && isNaN(limitNum)) {
      throw new BadRequestException('Invalid limit. Must be a number');
    }

    const stats = await this.dashboardService.getStatsByPeriod(period);

    // Filter by date range if provided
    let filteredStats = stats;
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();

      if (startDate && isNaN(start.getTime())) {
        throw new BadRequestException('Invalid startDate format');
      }
      if (endDate && isNaN(end.getTime())) {
        throw new BadRequestException('Invalid endDate format');
      }

      filteredStats = stats.filter((stat) => {
        const statDate = new Date(stat.date);
        return statDate >= start && statDate <= end;
      });
    }

    // Sort by date descending and limit
    return filteredStats
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limitNum);
  }

  // Lấy so sánh chi tiết giữa 2 kỳ
  @Get('/stats/:period/comparison')
  @Public()
  async getStatsComparison(
    @Param('period') period: string,
    @Query('date') date?: string,
  ) {
    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
      throw new BadRequestException(
        'Invalid period. Must be one of: daily, weekly, monthly, yearly',
      );
    }

    const targetDate = date ? new Date(date) : new Date();

    if (date && isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return await this.dashboardService.getStatsWithComparison(
      period,
      targetDate,
    );
  }

  // Lấy top sản phẩm bán chạy
  @Get('/products/top-selling')
  @Public()
  async getTopSellingProducts(
    @Query('period') period: string = 'daily',
    @Query('limit') limit?: string,
    @Query('date') date?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 5;
    const targetDate = date ? new Date(date) : new Date();

    const stats = await this.dashboardService.getStats(period, targetDate);

    if (!stats) {
      return [];
    }

    return stats.topSellingProducts.slice(0, limitNum);
  }

  // Lấy sản phẩm được xem nhiều nhất
  @Get('/products/most-viewed')
  @Public()
  async getMostViewedProducts(
    @Query('period') period: string = 'daily',
    @Query('limit') limit?: string,
    @Query('date') date?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 5;
    const targetDate = date ? new Date(date) : new Date();

    const stats = await this.dashboardService.getStats(period, targetDate);

    if (!stats) {
      return [];
    }

    return stats.mostViewedProducts.slice(0, limitNum);
  }

  // Lấy thống kê phương thức thanh toán
  @Get('/payment-methods')
  @Public()
  async getPaymentMethodStats(
    @Query('period') period: string = 'daily',
    @Query('date') date?: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();

    const stats = await this.dashboardService.getStats(period, targetDate);

    if (!stats) {
      return [];
    }

    return stats.paymentMethods;
  }

  // Lấy tổng quan dashboard
  @Get('/overview')
  @Public()
  async getDashboardOverview(
    @Query('period') period: string = 'daily',
    @Query('date') date?: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();

    const comparison = await this.dashboardService.getStatsWithComparison(
      period,
      targetDate,
    );

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

  // Endpoint để cập nhật stats thủ công
  @Post('/update/daily')
  @Public()
  async updateDailyStats() {
    await this.dashboardService.updateDailyStats();
    return {
      message: 'Daily stats updated successfully',
      timestamp: new Date(),
    };
  }

  @Post('/update/weekly')
  @Public()
  async updateWeeklyStats() {
    await this.dashboardService.updateWeeklyStats();
    return {
      message: 'Weekly stats updated successfully',
      timestamp: new Date(),
    };
  }

  @Post('/update/monthly')
  @Public()
  async updateMonthlyStats() {
    await this.dashboardService.updateMonthlyStats();
    return {
      message: 'Monthly stats updated successfully',
      timestamp: new Date(),
    };
  }

  @Post('/update/yearly')
  @Public()
  async updateYearlyStats() {
    await this.dashboardService.updateYearlyStats();
    return {
      message: 'Yearly stats updated successfully',
      timestamp: new Date(),
    };
  }

  // Endpoint để force update tất cả stats
  @Post('/update/all')
  @Public()
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

  // Lấy thống kê theo range tùy chỉnh
  @Get('/stats/custom-range')
  @Public()
  async getCustomRangeStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('groupBy') groupBy: string = 'daily',
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (start >= end) {
      throw new BadRequestException('startDate must be before endDate');
    }

    const stats = await this.dashboardService.getStatsByPeriod(groupBy);

    return stats
      .filter((stat) => {
        const statDate = new Date(stat.date);
        return statDate >= start && statDate <= end;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Health check endpoint
  @Get('/health')
  @Public()
  async healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date(),
      service: 'Dashboard API',
    };
  }
}
