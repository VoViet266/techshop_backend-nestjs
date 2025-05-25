import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Cameras,
  CamerasSchema,
  Connectivities,
  ConnectivitiesSchema,
  Products,
  ProductSchema,
  Variants,
  VariantSchema,
} from './schemas/product.schema';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductSchema },
      { name: Variants.name, schema: VariantSchema },
      { name: Connectivities.name, schema: ConnectivitiesSchema },
      { name: Cameras.name, schema: CamerasSchema },
    ]),
  ],
})
export class ProductModule {}
