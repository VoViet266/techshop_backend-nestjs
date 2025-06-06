import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { Products, ProductSchema } from 'src/product/schemas/product.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [InventoryController],
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Products.name, schema: ProductSchema }, // Assuming 'Products' is the name of the product model
    ]),

    CaslModule,
  ],
  providers: [InventoryService],
})
export class InventoryModule {}
