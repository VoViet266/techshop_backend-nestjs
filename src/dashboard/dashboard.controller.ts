import { Controller, Get, Query, Param } from '@nestjs/common';
import { DashboardService } from '../dashboard/dashboard.service';
import { Public } from 'src/decorator/publicDecorator';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/stats/:period')
  @Public()
  async getStats(
    @Param('period') period: string,
    @Query('date') date?: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();

    return await this.dashboardService.getStatsWithComparison(
      period,
      targetDate,
    );
  }

  @Get('/stats/:period/current')
  async getCurrentStats(@Param('period') period: string) {
    return await this.dashboardService.getStats(period);
  }

  @Get('/update/daily')
  async updateDaily() {
    await this.dashboardService.updateDailyStats();
    return { message: 'Daily stats updated successfully' };
  }
}
