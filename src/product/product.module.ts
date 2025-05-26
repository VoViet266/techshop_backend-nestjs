import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Products,
  ProductSchema,
  Variant,
  VariantSchema,
} from './schemas/product.schema';
import {
  Inventory,
  InventorySchema,
} from 'src/inventory/schemas/inventory.schema';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Variant.name, schema: VariantSchema },
    ]),
  ],
})
export class ProductModule {}
