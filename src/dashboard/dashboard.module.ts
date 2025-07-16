import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { mongo } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardStatsSchema } from './schemas/dashboard.schema';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';
import { Products, ProductSchema } from 'src/product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardStatsSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Products.name, schema: ProductSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
