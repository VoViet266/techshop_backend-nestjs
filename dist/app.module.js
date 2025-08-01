"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const brand_module_1 = require("./brand/brand.module");
const category_module_1 = require("./category/category.module");
const product_module_1 = require("./product/product.module");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongodb_config_1 = require("./config/mongodb.config");
const role_module_1 = require("./role/role.module");
const permission_module_1 = require("./permission/permission.module");
const branch_module_1 = require("./branch/branch.module");
const inventory_module_1 = require("./inventory/inventory.module");
const banner_module_1 = require("./banner/banner.module");
const mail_module_1 = require("./mail/mail.module");
const cart_module_1 = require("./cart/cart.module");
const order_module_1 = require("./order/order.module");
const payment_module_1 = require("./payment/payment.module");
const cloundinary_module_1 = require("./cloundinary/cloundinary.module");
const file_module_1 = require("./file/file.module");
const casl_module_1 = require("./casl/casl.module");
const recommendation_module_1 = require("./recommendation/recommendation.module");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const review_module_1 = require("./review/review.module");
const redis_module_1 = require("./redis/redis.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const schedule_1 = require("@nestjs/schedule");
const benefit_module_1 = require("./benefit/benefit.module");
const tfidf_mode_module_1 = require("./tfidf-mode/tfidf-mode.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            brand_module_1.BrandModule,
            category_module_1.CategoryModule,
            product_module_1.ProductModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.development.local', '.env.production.local', '.env'],
            }),
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forRootAsync(mongodb_config_1.MongooseConfigService),
            role_module_1.RoleModule,
            permission_module_1.PermissionModule,
            branch_module_1.BranchModule,
            inventory_module_1.InventoryModule,
            banner_module_1.BannerModule,
            mail_module_1.MailModule,
            cart_module_1.CartModule,
            order_module_1.OrderModule,
            payment_module_1.PaymentModule,
            cloundinary_module_1.CloundinaryModule,
            file_module_1.FileModule,
            casl_module_1.CaslModule,
            recommendation_module_1.RecommendationModule,
            chatbot_module_1.ChatbotModule,
            review_module_1.ReviewModule,
            redis_module_1.RedisModule,
            dashboard_module_1.DashboardModule,
            benefit_module_1.BenefitModule,
            tfidf_mode_module_1.TfidfModeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map