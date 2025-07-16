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
import { Payment, PaymentSchema } from 'src/payment/schemas/payment.schema';

import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserModule } from 'src/user/user.module';
import {
  Promotion,
  PromotionSchema,
} from 'src/benefit/schemas/promotion.schema';
import { WarrantyPolicy, WarrantyPolicySchema } from 'src/benefit/schemas/warrantypolicy.schema';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [MongooseModule, OrderService],
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      // { name: Inventory.name, schema: InventorySchema },
      { name: Products.name, schema: ProductSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema },
      { name: Promotion.name, schema: PromotionSchema },
      {name : WarrantyPolicy.name, schema : WarrantyPolicySchema}
    ]),
    ProductModule,
    CartModule,
    CaslModule,
    InventoryModule,
    ProductModule,
    UserModule,
  ],
})
export class OrderModule {}
