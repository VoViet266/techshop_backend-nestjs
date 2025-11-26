import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductBenefitService } from './benefit.service';
import { Public } from 'src/decorator/publicDecorator';

@Controller('api/v1/benefits')
export class ProductBenefitController {
  constructor(private readonly benefitService: ProductBenefitService) {}

  @Post('promotions')
  createPromotion(@Body() body: any) {
    return this.benefitService.createPromotion(body);
  }

  @Get('promotions')
  @Public()
  getAllPromotions(@Query('categoryId') categoryId?: string) {
    return this.benefitService.getAllPromotions(categoryId);
  }

  @Get('promotions/:id')
  getPromotionById(@Param('id') id: string) {
    return this.benefitService.getPromotionById(id);
  }

  @Patch('promotions/:id')
  updatePromotion(@Param('id') id: string, @Body() body: any) {
    return this.benefitService.updatePromotion(id, body);
  }

  @Delete('promotions/:id')
  deletePromotion(@Param('id') id: string) {
    return this.benefitService.deletePromotion(id);
  }

  @Post('warranties')
  createWarranty(@Body() body: any) {
    return this.benefitService.createWarrantyPolicy(body);
  }

  @Get('warranties')
  @Public()
  getAllWarranties(@Query('categoryId') categoryId?: string) {
    return this.benefitService.getAllWarranties(categoryId);
  }

  @Get('warranties/:id')
  getWarrantyById(@Param('id') id: string) {
    return this.benefitService.getWarrantyById(id);
  }

  @Patch('warranties/:id')
  updateWarranty(@Param('id') id: string, @Body() body: any) {
    return this.benefitService.updateWarranty(id, body);
  }

  @Delete('warranties/:id')
  deleteWarranty(@Param('id') id: string) {
    return this.benefitService.deleteWarranty(id);
  }
}
