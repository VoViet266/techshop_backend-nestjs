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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("./schemas/product.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const slugify_1 = __importDefault(require("slugify"));
const api_query_params_1 = __importDefault(require("api-query-params"));
const variant_schema_1 = require("./schemas/variant.schema");
const ioredis_1 = __importDefault(require("ioredis"));
let ProductService = class ProductService {
    constructor(productModel, variantModel, inventoryModel, redisClient) {
        this.productModel = productModel;
        this.variantModel = variantModel;
        this.inventoryModel = inventoryModel;
        this.redisClient = redisClient;
    }
    async create(createProductDto) {
        const createdVariants = await this.variantModel.insertMany(createProductDto?.variants?.map((variant) => ({
            ...variant,
        })));
        const createdProduct = await this.productModel.create({
            ...createProductDto,
            variants: createdVariants?.map((variant) => variant._id) || [],
        });
        return createdProduct;
    }
    async insertManyProduct(createProductDtos) {
        const productsToInsert = await Promise.all(createProductDtos.map(async (createProductDto) => {
            const createdVariants = await this.variantModel.insertMany(createProductDto.variants.map((variant) => ({
                ...variant,
                compareAtPrice: variant.price + (variant.price * createProductDto.discount) / 100,
            })));
            const slug = (0, slugify_1.default)(createProductDto.name, {
                lower: true,
                strict: true,
                locale: 'vi',
            });
            return {
                ...createProductDto,
                slug: slug,
                variants: createdVariants.map((variant) => variant._id),
            };
        }));
        const createdProducts = await this.productModel.insertMany(productsToInsert);
        return createdProducts;
    }
    async autocompleteSearch(query) {
        const result = await this.productModel.aggregate([
            {
                $search: {
                    index: 'product_tech_search',
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'name',
                                    fuzzy: { maxEdits: 2, prefixLength: 2 },
                                    tokenOrder: 'sequential',
                                },
                            },
                            {
                                text: {
                                    query: query,
                                    path: 'name',
                                    fuzzy: { maxEdits: 2 },
                                },
                            },
                        ],
                        minimumShouldMatch: 1,
                    },
                },
            },
            {
                $match: {
                    isActive: true,
                    isDeleted: { $ne: true },
                },
            },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand',
                },
            },
            {
                $lookup: {
                    from: 'variants',
                    localField: 'variants',
                    foreignField: '_id',
                    as: 'variants',
                },
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    description: 1,
                    discount: 1,
                    tags: 1,
                    category: {
                        _id: '$category._id',
                        name: '$category.name',
                    },
                    brand: {
                        _id: '$brand._id',
                        name: '$brand.name',
                    },
                    attributes: 1,
                    variants: 1,
                    isActive: 1,
                    isFeatured: 1,
                    averageRating: 1,
                    reviewCount: 1,
                },
            },
        ]);
        if (result.length === 0) {
            return ` không tìm thấy sản phẩm với query ${query}`;
        }
        return result;
    }
    async findAll(currentPage, limit, qs) {
        const { filter } = (0, api_query_params_1.default)(qs);
        delete filter.page;
        delete filter.limit;
        filter.isDeleted = false;
        const offset = (currentPage - 1) * limit;
        const defaultLimit = limit;
        let result;
        let totalItems;
        if (filter.category || filter.brand) {
            const matchConditions = {
                isDeleted: false,
            };
            if (filter.category) {
                matchConditions['category.name'] = {
                    $regex: filter.category,
                    $options: 'i',
                };
            }
            if (filter.brand) {
                matchConditions['brand.name'] = {
                    $regex: filter.brand,
                    $options: 'i',
                };
            }
            const aggregatePipeline = [
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brand',
                        foreignField: '_id',
                        as: 'brand',
                    },
                },
                {
                    $unwind: {
                        path: '$brand',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                { $match: matchConditions },
                {
                    $lookup: {
                        from: 'variants',
                        localField: 'variants',
                        foreignField: '_id',
                        as: 'variants',
                    },
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        discount: 1,
                        tags: 1,
                        slug: 1,
                        overviewImage: 1,
                        attributes: 1,
                        category: {
                            _id: '$category._id',
                            name: '$category.name',
                            logo: '$category.logo',
                        },
                        brand: {
                            _id: '$brand._id',
                            name: '$brand.name',
                            logo: '$brand.logo',
                        },
                        variants: '$variants',
                    },
                },
                {
                    $facet: {
                        totalItems: [{ $count: 'count' }],
                        data: [{ $skip: offset }, { $limit: defaultLimit }],
                    },
                },
            ];
            const aggregateResults = await this.productModel.aggregate(aggregatePipeline);
            result = aggregateResults[0].data;
            totalItems = aggregateResults[0].totalItems[0]?.count || 0;
        }
        else {
            totalItems = await this.productModel.countDocuments(filter);
            result = await this.productModel
                .find(filter)
                .skip(offset)
                .limit(defaultLimit)
                .populate({
                path: 'variants',
                select: 'name price color memory images',
            })
                .populate('category', 'name description logo configFields')
                .populate('brand', 'name description logo')
                .exec();
            result = result.sort((a, b) => {
                const maxPriceA = Math.max(...(a.variants?.map((v) => v.price) ?? [0]));
                const maxPriceB = Math.max(...(b.variants?.map((v) => v.price) ?? [0]));
                return maxPriceB - maxPriceA;
            });
        }
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const response = {
            meta: {
                currentPage,
                pageSize: defaultLimit,
                pages: totalPages,
                total: totalItems,
            },
            result,
        };
        return response;
    }
    async findOneById(id) {
        return await this.productModel
            .findById({ _id: id })
            .populate({
            path: 'variants',
            select: 'name price color memory images',
        })
            .populate('brand', 'name description logo')
            .populate('category', 'name description configFields ');
    }
    async update(id, updateProductDto) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.BadRequestException('Sản phẩm không tồn tại');
        }
        const variantIds = [];
        await Promise.all(updateProductDto.variants.map(async (variant, index) => {
            if (product.variants[index]) {
                const existingVariantId = product.variants[index];
                const updated = await this.variantModel.findByIdAndUpdate(existingVariantId, {
                    ...variant,
                }, { new: true });
                if (!updated) {
                    throw new common_1.BadRequestException(`Không tìm thấy biến thể với ID ${existingVariantId}`);
                }
                variantIds.push(updated._id.toString());
            }
            else {
                const created = await this.variantModel.create({
                    ...variant,
                });
                variantIds.push(created._id.toString());
            }
        }));
        if (product.variants.length > variantIds.length) {
            const toDelete = product.variants.slice(variantIds.length);
            await this.variantModel.deleteMany({ _id: { $in: toDelete } });
        }
        await this.productModel.updateOne({ _id: id }, {
            ...updateProductDto,
            attributes: updateProductDto.attributes,
            variants: variantIds,
        });
        this.redisClient.del(`product`);
        return { message: 'Cập nhật thành công' };
    }
    async countViews(id) {
        return await this.productModel.updateOne({ _id: id }, { $inc: { viewCount: 1 } });
    }
    async countOrders(id) {
        return await this.productModel.updateOne({ _id: id }, { $inc: { soldCount: 1 } });
    }
    async remove(id) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.BadRequestException('Sản phẩm không tồn tại');
        }
        const inventory = await this.inventoryModel.findOne({ product: id });
        if (inventory) {
            await this.inventoryModel.deleteMany({ product: id });
        }
        product.variants.map(async (v) => {
            return await this.variantModel.findByIdAndDelete(v);
        });
        await this.inventoryModel.deleteMany({ product: id });
        return this.productModel.softDelete({ _id: id });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Products.name)),
    __param(1, (0, mongoose_1.InjectModel)(variant_schema_1.Variant.name)),
    __param(2, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __param(3, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [Object, Object, Object, ioredis_1.default])
], ProductService);
//# sourceMappingURL=product.service.js.map