"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloundinaryModule = void 0;
const common_1 = require("@nestjs/common");
const cloundinary_service_1 = require("./cloundinary.service");
const cloundinary_controller_1 = require("./cloundinary.controller");
const cloudinary_provider_1 = require("./cloudinary.provider");
const config_1 = require("@nestjs/config");
const casl_module_1 = require("../casl/casl.module");
let CloundinaryModule = class CloundinaryModule {
};
exports.CloundinaryModule = CloundinaryModule;
exports.CloundinaryModule = CloundinaryModule = __decorate([
    (0, common_1.Module)({
        controllers: [cloundinary_controller_1.CloundinaryController],
        imports: [config_1.ConfigModule, casl_module_1.CaslModule],
        providers: [cloudinary_provider_1.CloudinaryProvider, cloundinary_service_1.CloundinaryService],
        exports: [cloudinary_provider_1.CloudinaryProvider, cloundinary_service_1.CloundinaryService],
    })
], CloundinaryModule);
//# sourceMappingURL=cloundinary.module.js.map