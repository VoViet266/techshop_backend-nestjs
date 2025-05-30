import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';
import { ProductSchema } from 'src/product/schemas/product.schema';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
    ]),
  ],
})
export class PromotionModule {}
