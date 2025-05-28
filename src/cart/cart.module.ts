import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import {
  Products,
  ProductSchema,
  Variant,
  VariantSchema,
} from 'src/product/schemas/product.schema';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema,
      },
      {
        name: Products.name,
        schema: ProductSchema,
      },
      { name: Variant.name, schema: VariantSchema },
    ]),
  ],
})
export class CartModule {}
