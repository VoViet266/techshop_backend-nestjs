import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongodb.config';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { StoreModule } from './store/store.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BrandModule,
    CategoryModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.production.local', '.env'],
    }),
    MongooseModule.forRootAsync(MongooseConfigService),
    RoleModule,
    PermissionModule,
    StoreModule,
    InventoryModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
