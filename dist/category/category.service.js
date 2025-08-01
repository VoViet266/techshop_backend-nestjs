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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const category_schema_1 = require("./schemas/category.schema");
const slugify_1 = __importDefault(require("slugify"));
let CategoryService = class CategoryService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async create(createCategoryDto) {
        const existingCategory = await this.categoryModel
            .findOne({
            name: createCategoryDto.name,
        })
            .lean();
        if (existingCategory) {
            throw new Error(`Category with name ${createCategoryDto.name} already exists`);
        }
        const slug = (0, slugify_1.default)(createCategoryDto.name, {
            lower: true,
            strict: true,
            locale: 'vi',
        });
        return this.categoryModel.create({ ...createCategoryDto, slug });
    }
    findAll() {
        return this.categoryModel.find().sort({ createdAt: -1 }).lean();
    }
    findOne(id) {
        return this.categoryModel.findById(id);
    }
    async update(id, updateCategoryDto) {
        const existingCategory = await this.categoryModel.findById(id).lean();
        if (!existingCategory) {
            throw new common_1.NotFoundException(`Category with id ${id} does not exist`);
        }
        const result = await this.categoryModel
            .findByIdAndUpdate(id, { $set: updateCategoryDto }, {
            new: true,
            runValidators: true,
        })
            .lean();
        return result;
    }
    async remove(id) {
        const existingCategory = await this.categoryModel.findById(id).lean();
        if (!existingCategory) {
            throw new common_1.ConflictException(`Category with id ${id} does not exist`);
        }
        return this.categoryModel.deleteOne({ _id: id }).then((result) => {
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException(`Category with id ${id} does not exist`);
            }
            return { message: 'Category deleted successfully' };
        });
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [Object])
], CategoryService);
//# sourceMappingURL=category.service.js.map