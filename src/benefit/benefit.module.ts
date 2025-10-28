import { Module } from '@nestjs/common';
import { ProductBenefitService } from './benefit.service';
import { ProductBenefitController } from './benefit.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';
import {
  WarrantyPolicy,
  WarrantyPolicySchema,
} from './schemas/warrantypolicy.schema';

@Module({
  controllers: [ProductBenefitController],
  providers: [ProductBenefitService],
  exports: [ProductBenefitService],
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
      { name: WarrantyPolicy.name, schema: WarrantyPolicySchema },
    ]),
  ],
})
export class BenefitModule {}
