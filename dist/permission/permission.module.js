"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModule = void 0;
const common_1 = require("@nestjs/common");
const permission_service_1 = require("./permission.service");
const permission_controller_1 = require("./permission.controller");
const mongoose_1 = require("@nestjs/mongoose");
const permission_schema_1 = require("./schemas/permission.schema");
const casl_module_1 = require("../casl/casl.module");
let PermissionModule = class PermissionModule {
};
exports.PermissionModule = PermissionModule;
exports.PermissionModule = PermissionModule = __decorate([
    (0, common_1.Module)({
        controllers: [permission_controller_1.PermissionController],
        providers: [permission_service_1.PermissionService],
        exports: [permission_service_1.PermissionService],
        imports: [
            casl_module_1.CaslModule,
            mongoose_1.MongooseModule.forFeature([
                {
                    name: permission_schema_1.Permission.name,
                    schema: permission_schema_1.PermissionSchema,
                },
            ]),
        ],
    })
], PermissionModule);
//# sourceMappingURL=permission.module.js.map