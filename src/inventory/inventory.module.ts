import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { Products, ProductSchema } from 'src/product/schemas/product.schema';
import { CaslModule } from 'src/casl/casl.module';
import {
  StockMovement,
  StockMovementSchema,
} from './schemas/stock-movement.schema';
import { Transfer, TransferSchema } from './schemas/transfer.schema';

@Module({
  controllers: [InventoryController],
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Products.name, schema: ProductSchema },
      { name: StockMovement.name, schema: StockMovementSchema },
      { name: Transfer.name, schema: TransferSchema },
    ]),

    CaslModule,
  ],
  providers: [InventoryService],
  exports: [
    MongooseModule, // Export để module khác có thể sử dụng
    InventoryService, // Export service để có thể inject vào các module khác
  ],
})
export class InventoryModule {}
