import { Module } from '@nestjs/common';
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
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { InventoryService } from './inventory.service';
import { Variant, VariantSchema } from 'src/product/schemas/variant.schema';
import { Branch, BranchSchema } from 'src/branch/schemas/branch.schema';

@Module({
  controllers: [InventoryController],
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: User.name, schema: UserSchema },
      { name: Products.name, schema: ProductSchema },
      { name: StockMovement.name, schema: StockMovementSchema },
      { name: Transfer.name, schema: TransferSchema },
      { name: Variant.name, schema: VariantSchema },
      { name: Branch.name, schema: BranchSchema },
      
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
