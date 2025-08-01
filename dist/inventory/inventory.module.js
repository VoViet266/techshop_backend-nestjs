"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_controller_1 = require("./inventory.controller");
const mongoose_1 = require("@nestjs/mongoose");
const inventory_schema_1 = require("./schemas/inventory.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const casl_module_1 = require("../casl/casl.module");
const stock_movement_schema_1 = require("./schemas/stock-movement.schema");
const transfer_schema_1 = require("./schemas/transfer.schema");
const user_schema_1 = require("../user/schemas/user.schema");
const inventory_service_1 = require("./inventory.service");
const variant_schema_1 = require("../product/schemas/variant.schema");
const branch_schema_1 = require("../branch/schemas/branch.schema");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        controllers: [inventory_controller_1.InventoryController],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: inventory_schema_1.Inventory.name, schema: inventory_schema_1.InventorySchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: product_schema_1.Products.name, schema: product_schema_1.ProductSchema },
                { name: stock_movement_schema_1.StockMovement.name, schema: stock_movement_schema_1.StockMovementSchema },
                { name: transfer_schema_1.Transfer.name, schema: transfer_schema_1.TransferSchema },
                { name: variant_schema_1.Variant.name, schema: variant_schema_1.VariantSchema },
                { name: branch_schema_1.Branch.name, schema: branch_schema_1.BranchSchema },
            ]),
            casl_module_1.CaslModule,
        ],
        providers: [inventory_service_1.InventoryService],
        exports: [
            mongoose_1.MongooseModule,
            inventory_service_1.InventoryService,
        ],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map