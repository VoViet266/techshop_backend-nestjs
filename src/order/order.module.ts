import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';
import {
  Inventory,
  InventorySchema,
} from 'src/inventory/schemas/inventory.schema';
import { Products, ProductSchema } from 'src/product/schemas/product.schema';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import { CaslModule } from 'src/casl/casl.module';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [
    MongooseModule, // 👈 export để module khác dùng được
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Products.name, schema: ProductSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
    ProductModule,
    CartModule,
    CaslModule,
    InventoryModule,
   // Import InventoryModule if needed
  ],
})
export class OrderModule {}
