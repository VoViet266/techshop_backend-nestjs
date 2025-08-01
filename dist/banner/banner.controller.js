"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const banner_service_1 = require("./banner.service");
const create_banner_dto_1 = require("./dto/create-banner.dto");
const update_banner_dto_1 = require("./dto/update-banner.dto");
const publicDecorator_1 = require("../decorator/publicDecorator");
const policies_guard_1 = require("../common/guards/policies.guard");
const policies_decorator_1 = require("../decorator/policies.decorator");
const permission_enum_1 = require("../constant/permission.enum");
let BannerController = class BannerController {
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    create(createBannerDto) {
        return this.bannerService.create(createBannerDto);
    }
    findAll() {
        return this.bannerService.findAll();
    }
    findOne(id) {
        return this.bannerService.findOne(+id);
    }
    update(id, updateBannerDto) {
        return this.bannerService.update(id, updateBannerDto);
    }
    remove(id) {
        return this.bannerService.remove(id);
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Create, permission_enum_1.Subjects.Banner)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_banner_dto_1.CreateBannerDto]),
    __metadata("design:returntype", void 0)
], BannerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BannerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BannerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Update, permission_enum_1.Subjects.Banner)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_banner_dto_1.UpdateBannerDto]),
    __metadata("design:returntype", void 0)
], BannerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Delete, permission_enum_1.Subjects.Banner)),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BannerController.prototype, "remove", null);
exports.BannerController = BannerController = __decorate([
    (0, common_1.Controller)('api/v1/banners'),
    __metadata("design:paramtypes", [banner_service_1.BannerService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map