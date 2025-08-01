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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const create_inventory_dto_1 = require("./dto/create-inventory.dto");
const update_inventory_dto_1 = require("./dto/update-inventory.dto");
const swagger_1 = require("@nestjs/swagger");
const policies_guard_1 = require("../common/guards/policies.guard");
const policies_decorator_1 = require("../decorator/policies.decorator");
const permission_enum_1 = require("../constant/permission.enum");
const userDecorator_1 = require("../decorator/userDecorator");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    create(createInventoryDto, user) {
        return this.inventoryService.create(createInventoryDto, user);
    }
    findAll(user) {
        return this.inventoryService.findAll(user);
    }
    findOne(productId, branchId, variantId) {
        return this.inventoryService.getStockProduct(productId, branchId, variantId);
    }
    update(id, updateInventoryDto) {
        return this.inventoryService.update(id, updateInventoryDto);
    }
    remove(id) {
        return this.inventoryService.remove(id);
    }
    async importStock(dto, user) {
        return this.inventoryService.importStock(dto, user);
    }
    async getAllImport(user) {
        return this.inventoryService.findImport(user);
    }
    async getImport(id) {
        return this.inventoryService.getImportDetail(id);
    }
    async getAllExport(user) {
        return this.inventoryService.findExport(user);
    }
    async getExport(id) {
        return this.inventoryService.getExportDetail(id);
    }
    async exportStock(dto, user) {
        return this.inventoryService.exportStock(dto, user);
    }
    async getAllTransfer() {
        return this.inventoryService.findTransfer();
    }
    async transferStock(dto, user) {
        return this.inventoryService.transferStock(dto, user);
    }
    async getTransferDetail(id) {
        return this.inventoryService.getTransferDetail(id);
    }
    async updateTransfer(id, dto, user) {
        return this.inventoryService.updateTransfer(id, dto, user);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Create, permission_enum_1.Subjects.Inventory)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateInventoryDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('check-stock'),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('branchId')),
    __param(2, (0, common_1.Query)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Update, permission_enum_1.Subjects.Inventory)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_dto_1.UpdateInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Create, permission_enum_1.Subjects.Inventory)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateStockMovementDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "importStock", null);
__decorate([
    (0, common_1.Get)('getimport'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Inventory)),
    __param(0, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAllImport", null);
__decorate([
    (0, common_1.Get)('getimport/:id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Inventory)),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getImport", null);
__decorate([
    (0, common_1.Get)('getexport'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Inventory)),
    __param(0, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAllExport", null);
__decorate([
    (0, common_1.Get)('getexport/:id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Inventory)),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getExport", null);
__decorate([
    (0, common_1.Post)('export'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Create, permission_enum_1.Subjects.StockMovement)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateStockMovementDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "exportStock", null);
__decorate([
    (0, common_1.Get)('/transfer'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Transfer)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAllTransfer", null);
__decorate([
    (0, common_1.Post)('/transfer'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Create, permission_enum_1.Subjects.Transfer)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateTransferDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "transferStock", null);
__decorate([
    (0, common_1.Get)('get_transfer/:id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Transfer)),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getTransferDetail", null);
__decorate([
    (0, common_1.Patch)('/transfer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_inventory_dto_1.CreateTransferDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateTransfer", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('api/v1/inventories'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map