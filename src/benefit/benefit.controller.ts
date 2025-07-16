import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductBenefitService } from './benefit.service';

@Controller('api/v1/benefits')
export class ProductBenefitController {
  constructor(private readonly benefitService: ProductBenefitService) {}

  @Post('promotions')
  createPromotion(@Body() body: any) {
    return this.benefitService.createPromotion(body);
  }

  @Get('promotions')
  getAllPromotions() {
    return this.benefitService.getAllPromotions();
  }

  @Get('promotions/:id')
  getPromotionById(@Param('id') id: string) {
    return this.benefitService.getPromotionById(id);
  }

  @Post('warranties')
  createWarranty(@Body() body: any) {
    return this.benefitService.createWarrantyPolicy(body);
  }

  @Get('warranties')
  getAllWarranties() {
    return this.benefitService.getAllWarranties();
  }

  @Get('warranties/:id')
  getWarrantyById(@Param('id') id: string) {
    return this.benefitService.getWarrantyById(id);
  }
}
