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
exports.branchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const branch_schema_1 = require("./schemas/branch.schema");
let branchService = class branchService {
    constructor(branchModel) {
        this.branchModel = branchModel;
    }
    create(createBranchDto) {
        return this.branchModel.create(createBranchDto);
    }
    findAll() {
        return this.branchModel.find().populate({
            path: 'manager',
            select: 'email name',
        });
    }
    findOne(id) {
        return this.branchModel.findById(id).exec();
    }
    async update(id, updateBranchDto) {
        const storeExists = await this.branchModel.findById(id);
        if (!storeExists) {
            throw new Error(`branch with id ${id} does not exist`);
        }
        const updatedStore = await this.branchModel.updateOne({ _id: id }, { $set: updateBranchDto }, { new: true });
        if (!updatedStore) {
            throw new Error(`Không thể cập nhật cửa hàng với id ${id}`);
        }
        return updatedStore;
    }
    remove(id) {
        const storeExists = this.branchModel.findById(id);
        if (!storeExists) {
            throw new Error(`branch with id ${id} does not exist`);
        }
        return this.branchModel.softDelete({ _id: id });
    }
};
exports.branchService = branchService;
exports.branchService = branchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __metadata("design:paramtypes", [Object])
], branchService);
//# sourceMappingURL=branch.service.js.map