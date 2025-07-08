import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

import { Public } from 'src/decorator/publicDecorator';
import { RecordDto } from './dto/record.dto';

@Controller('api/v1')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Public()
  @Get('recomment/:id')
  async getRecommendedProducts(
    @Param('id') productId: string,
    @Query('limit') limit: string = '5',
  ) {
    return this.recommendationService.getRecommendedProducts(
      productId,
      parseInt(limit, 10),
    );
  }

  @Post('recomment/record-view-history')
  @Public()
  async recordViewHistory(@Body() recordDto: RecordDto) {
   
    if (!recordDto.userId || !recordDto.productId) {
      throw new BadRequestException('userId and productId are required');
    }

    return this.recommendationService.recordViewHistory(
      recordDto.userId,
      recordDto.productId,
    );
  }

  @Get('recomment/get-by-user/:userId')
  async getRecommendationsByUser(@Param('userId') userId: string) {
    return this.recommendationService.getRecommendationsForUser(userId);
  }

  @Get()
  @Public()
  async getRecommendationsByProductIds(@Query('ids') ids: string) {
    if (!ids) {
      throw new BadRequestException('ids query is required');
    }

    const productIds = ids.split(',').filter((id) => !!id);
    if (productIds.length === 0) {
      throw new BadRequestException('No valid product IDs provided');
    }

    return this.recommendationService.getRecommendationsFromViewedProducts(
      productIds,
    );
  }
}
