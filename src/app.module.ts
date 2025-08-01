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
import { BranchModule } from './branch/branch.module';
import { InventoryModule } from './inventory/inventory.module';
import { BannerModule } from './banner/banner.module';
import { MailModule } from './mail/mail.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { CloundinaryModule } from './cloundinary/cloundinary.module';
import { FileModule } from './file/file.module';
import { CaslModule } from './casl/casl.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ReviewModule } from './review/review.module';
import { RedisModule } from './redis/redis.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BenefitModule } from './benefit/benefit.module';
import { TfidfModeModule } from './tfidf-mode/tfidf-mode.module';

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
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync(MongooseConfigService),
    RoleModule,
    PermissionModule,
    BranchModule,
    InventoryModule,
    BannerModule,
    MailModule,
    CartModule,
    OrderModule,
    PaymentModule,
    CloundinaryModule,
    FileModule,
    CaslModule,
    RecommendationModule,
    ChatbotModule,
    ReviewModule,
    RedisModule,
    DashboardModule,
    BenefitModule,
    TfidfModeModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
