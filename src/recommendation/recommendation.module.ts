import { Module, OnModuleInit } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductSchema } from 'src/product/schemas/product.schema';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    ProductModule,
    MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
