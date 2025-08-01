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
exports.BranchController = void 0;
const common_1 = require("@nestjs/common");
const branch_service_1 = require("./branch.service");
const create_branch_dto_1 = require("./dto/create-branch.dto");
const update_branch_dto_1 = require("./dto/update-branch.dto");
const publicDecorator_1 = require("../decorator/publicDecorator");
const policies_guard_1 = require("../common/guards/policies.guard");
const policies_decorator_1 = require("../decorator/policies.decorator");
const permission_enum_1 = require("../constant/permission.enum");
let BranchController = class BranchController {
    constructor(branchService) {
        this.branchService = branchService;
    }
    create(createBranchDto) {
        return this.branchService.create(createBranchDto);
    }
    findAll() {
        return this.branchService.findAll();
    }
    findOne(id) {
        return this.branchService.findOne(id);
    }
    update(id, updateBranchDto) {
        const storeExists = this.branchService.findOne(id);
        if (!storeExists) {
            throw new Error(`branch with id ${id} does not exist`);
        }
        return this.branchService.update(id, updateBranchDto);
    }
    remove(id) {
        return this.branchService.remove(id);
    }
};
exports.BranchController = BranchController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Create, permission_enum_1.Subjects.Branch)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_branch_dto_1.CreateBranchDto]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, publicDecorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Update, permission_enum_1.Subjects.Branch)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_branch_dto_1.UpdateBranchDto]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Update, permission_enum_1.Subjects.Branch) ||
        ability.can(permission_enum_1.Actions.Delete, permission_enum_1.Subjects.Branch)),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "remove", null);
exports.BranchController = BranchController = __decorate([
    (0, common_1.Controller)('api/v1/branchs'),
    __metadata("design:paramtypes", [branch_service_1.branchService])
], BranchController);
//# sourceMappingURL=branch.controller.js.map