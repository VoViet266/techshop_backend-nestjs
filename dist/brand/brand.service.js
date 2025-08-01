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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const brand_schema_1 = require("./schemas/brand.schema");
let BrandService = class BrandService {
    constructor(brandModel) {
        this.brandModel = brandModel;
    }
    create(createBrandDto) {
        return this.brandModel.create(createBrandDto);
    }
    findAll() {
        return this.brandModel.find().lean();
    }
    async findOne(id) {
        return this.brandModel
            .findById(id)
            .exec()
            .then((brand) => {
            if (!brand) {
                throw new Error(`Brand with id ${id} not found`);
            }
            return brand;
        });
    }
    async update(id, updateBrandDto) {
        const existingBrand = await this.brandModel.findById(id);
        if (!existingBrand) {
            throw new Error(`Brand with id ${id} does not exist`);
        }
        return this.brandModel.updateOne({ _id: id }, { $set: updateBrandDto }, { new: true, runValidators: true });
    }
    async remove(id) {
        return this.brandModel.deleteOne({ _id: id }).then((result) => {
            if (result.deletedCount === 0) {
                throw new Error(`Brand with id ${id} does not exist`);
            }
            return { message: 'Brand deleted successfully' };
        });
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(brand_schema_1.Brand.name)),
    __metadata("design:paramtypes", [Object])
], BrandService);
//# sourceMappingURL=brand.service.js.map