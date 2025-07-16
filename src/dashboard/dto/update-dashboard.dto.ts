import { PartialType } from '@nestjs/swagger';
import { CreateDashboardStatsDto } from './create-dashboard.dto';

export class UpdateDashboardDto extends PartialType(CreateDashboardStatsDto) {}
