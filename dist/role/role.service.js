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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const role_schema_1 = require("./schemas/role.schema");
const mongoose_2 = __importDefault(require("mongoose"));
let RoleService = class RoleService {
    constructor(roleModel) {
        this.roleModel = roleModel;
    }
    async create(createRoleDto, user) {
        let role = await this.roleModel.create({
            ...createRoleDto,
        });
        return role;
    }
    findAll() {
        return this.roleModel.find().populate({
            path: 'permissions',
        });
    }
    async update(id, updateRoleDto) {
        const role = await this.roleModel.findById(id);
        if (!role)
            throw new Error('Role not found');
        const currentPermissions = new Set(role.permissions.map((p) => p.toString()));
        const newPermissions = new Set(updateRoleDto.permissions);
        const permissionsToAdd = [];
        const permissionsToRemove = [];
        for (const p of newPermissions) {
            if (!currentPermissions.has(p)) {
                permissionsToAdd.push(p);
            }
        }
        for (const p of currentPermissions) {
            if (!newPermissions.has(p)) {
                permissionsToRemove.push(p);
            }
        }
        if (permissionsToRemove.length) {
            await this.roleModel.updateOne({ _id: id }, { $pull: { permissions: { $in: permissionsToRemove } } });
        }
        if (permissionsToAdd.length) {
            await this.roleModel.updateOne({ _id: id }, { $addToSet: { permissions: { $each: permissionsToAdd } } });
        }
        await this.roleModel.updateOne({ _id: id }, { $set: { updatedAt: new Date() } });
        return { success: true };
    }
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('not found role');
        }
        return (await this.roleModel.findById(id)).populate({
            path: 'permissions',
            select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
        });
    }
    remove(id) {
        return this.roleModel.deleteOne({ _id: id });
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [Object])
], RoleService);
//# sourceMappingURL=role.service.js.map