import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

import { Public } from 'src/decorator/publicDecorator';

@Controller('api/v1/recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  // @Post()
  // create(@Body() createRecommendationDto: CreateRecommendationDto) {
  //   return this.recommendationService.create(createRecommendationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.recommendationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.recommendationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRecommendationDto: UpdateRecommendationDto) {
  //   return this.recommendationService.update(+id, updateRecommendationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.recommendationService.remove(+id);
  // }
  @Public()
  @Get(':id')
  async getRecommendedProducts(
    @Param('id') productId: string,
    @Query('limit') limit: string = '5',
  ) {
    return this.recommendationService.getRecommendedProducts(
      productId,
      parseInt(limit, 10),
    );
  }
}
