"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const product_controller_1 = require("./product.controller");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("./schemas/product.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const variant_schema_1 = require("./schemas/variant.schema");
const category_schema_1 = require("../category/schemas/category.schema");
const brand_schema_1 = require("../brand/schemas/brand.schema");
const casl_module_1 = require("../casl/casl.module");
const platform_express_1 = require("@nestjs/platform-express");
const multer_config_1 = require("../config/multer.config");
const review_schema_1 = require("../review/schemas/review.schema");
const review_module_1 = require("../review/review.module");
const redis_module_1 = require("../redis/redis.module");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService],
        imports: [
            redis_module_1.RedisModule,
            review_module_1.ReviewModule,
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.Products.name, schema: product_schema_1.ProductSchema },
                { name: inventory_schema_1.Inventory.name, schema: inventory_schema_1.InventorySchema },
                { name: variant_schema_1.Variant.name, schema: variant_schema_1.VariantSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: brand_schema_1.Brand.name, schema: brand_schema_1.BrandSchema },
                { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
            ]),
            platform_express_1.MulterModule.registerAsync({
                useClass: multer_config_1.MulterConfigService,
            }),
            casl_module_1.CaslModule,
        ],
        exports: [ProductModule, mongoose_1.MongooseModule],
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map