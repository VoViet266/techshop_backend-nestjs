import { Module, OnModuleInit } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductSchema } from 'src/product/schemas/product.schema';
import { ProductModule } from 'src/product/product.module';
import {
  ViewHistory,
  ViewHistorySchema,
} from './schemas/view_histories.schema';
import {
  TfidfModel,
  TfidfModelSchema,
} from 'src/tfidf-mode/schemas/tfidf-mode.schema';

@Module({
  imports: [
    ProductModule,
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductSchema },
      { name: ViewHistory.name, schema: ViewHistorySchema },
      { name: TfidfModel.name, schema: TfidfModelSchema },
    ]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
