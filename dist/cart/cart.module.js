"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const cart_controller_1 = require("./cart.controller");
const mongoose_1 = require("@nestjs/mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const variant_schema_1 = require("../product/schemas/variant.schema");
const branch_schema_1 = require("../branch/schemas/branch.schema");
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        controllers: [cart_controller_1.CartController],
        providers: [cart_service_1.CartService],
        exports: [cart_service_1.CartService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: cart_schema_1.Cart.name,
                    schema: cart_schema_1.CartSchema,
                },
                {
                    name: product_schema_1.Products.name,
                    schema: product_schema_1.ProductSchema,
                },
                { name: variant_schema_1.Variant.name, schema: variant_schema_1.VariantSchema },
                { name: branch_schema_1.Branch.name, schema: branch_schema_1.BranchSchema },
            ]),
        ],
    })
], CartModule);
//# sourceMappingURL=cart.module.js.map