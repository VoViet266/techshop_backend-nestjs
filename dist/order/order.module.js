"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const order_controller_1 = require("./order.controller");
const order_schema_1 = require("./schemas/order.schema");
const mongoose_1 = require("@nestjs/mongoose");
const product_module_1 = require("../product/product.module");
const cart_module_1 = require("../cart/cart.module");
const product_schema_1 = require("../product/schemas/product.schema");
const cart_schema_1 = require("../cart/schemas/cart.schema");
const casl_module_1 = require("../casl/casl.module");
const inventory_module_1 = require("../inventory/inventory.module");
const payment_schema_1 = require("../payment/schemas/payment.schema");
const user_schema_1 = require("../user/schemas/user.schema");
const user_module_1 = require("../user/user.module");
const promotion_schema_1 = require("../benefit/schemas/promotion.schema");
const warrantypolicy_schema_1 = require("../benefit/schemas/warrantypolicy.schema");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService],
        exports: [mongoose_1.MongooseModule, order_service_1.OrderService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: product_schema_1.Products.name, schema: product_schema_1.ProductSchema },
                { name: cart_schema_1.Cart.name, schema: cart_schema_1.CartSchema },
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: promotion_schema_1.Promotion.name, schema: promotion_schema_1.PromotionSchema },
                { name: warrantypolicy_schema_1.WarrantyPolicy.name, schema: warrantypolicy_schema_1.WarrantyPolicySchema }
            ]),
            product_module_1.ProductModule,
            cart_module_1.CartModule,
            casl_module_1.CaslModule,
            inventory_module_1.InventoryModule,
            product_module_1.ProductModule,
            user_module_1.UserModule,
        ],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map