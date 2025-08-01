import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { mongo } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardStatsSchema } from './schemas/dashboard.schema';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';
import { Products, ProductSchema } from 'src/product/schemas/product.schema';
import { Branch, BranchSchema } from 'src/branch/schemas/branch.schema';
import {
  Inventory,
  InventorySchema,
} from 'src/inventory/schemas/inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardStatsSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Products.name, schema: ProductSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
