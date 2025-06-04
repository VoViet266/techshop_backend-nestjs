import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductSchema } from './schemas/product.schema';
import {
  Inventory,
  InventorySchema,
} from 'src/inventory/schemas/inventory.schema';
import { Variant, VariantSchema } from './schemas/variant.schema';
import { Category, CategorySchema } from 'src/category/schemas/category.schema';
import { Brand, BrandSchema } from 'src/brand/schemas/brand.schema';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Variant.name, schema: VariantSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
  ],
})
export class ProductModule {}
