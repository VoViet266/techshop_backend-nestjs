import { PartialType } from '@nestjs/mapped-types';
import { CreateDashboardStatsDto } from './create-dashboard.dto';

export class UpdateDashboardDto extends PartialType(CreateDashboardStatsDto) {}
