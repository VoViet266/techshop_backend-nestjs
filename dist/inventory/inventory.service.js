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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const inventory_schema_1 = require("./schemas/inventory.schema");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("../product/schemas/product.schema");
const roles_enum_1 = require("../constant/roles.enum");
const stock_movement_schema_1 = require("./schemas/stock-movement.schema");
const transfer_schema_1 = require("./schemas/transfer.schema");
const mongoose_2 = __importDefault(require("mongoose"));
const transaction_enum_1 = require("../constant/transaction.enum");
let InventoryService = class InventoryService {
    constructor(inventoryModel, productModel, movementModel, transferModel) {
        this.inventoryModel = inventoryModel;
        this.productModel = productModel;
        this.movementModel = movementModel;
        this.transferModel = transferModel;
    }
    async create(createInventoryDto, user) {
        const product = await this.productModel.findById(createInventoryDto.product);
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        const existingInventory = await this.inventoryModel.findOne({
            store: createInventoryDto.branch,
            product: createInventoryDto.product,
        });
        if (existingInventory) {
            throw new common_1.ConflictException('Sản phẩm đã tồn tại trong kho');
        }
        const v = product.variants.map((variant) => ({
            variantId: variant,
        }));
        if (!createInventoryDto.variants.every((variant) => v.some((vItem) => vItem.variantId.toString() === variant.variantId))) {
            throw new common_1.BadRequestException('Variant SKU không hợp lệ hoặc không khớp với sản phẩm');
        }
        const inventoryData = {
            ...createInventoryDto,
            variants: createInventoryDto.variants.map((variant) => ({
                variantId: variant.variantId,
                stock: variant.stock,
                cost: variant.cost || 0,
            })),
            user: user,
        };
        return await this.inventoryModel.create(inventoryData);
    }
    async getStockProduct(productId, branchId, variantId) {
        const inventory = await this.inventoryModel
            .findOne({
            product: productId,
            branch: branchId,
            'variants.variantId': variantId,
        }, {
            variants: { $elemMatch: { variantId: variantId } },
        })
            .lean();
        const stock = inventory?.variants?.[0]?.stock ?? 0;
        return stock;
    }
    async findAll(user) {
        if (user.role === roles_enum_1.RolesUser.Admin) {
            return this.inventoryModel
                .find()
                .populate('product', 'name')
                .populate('branch', 'name location')
                .populate('variants.variantId', 'name sku')
                .sort({ createdAt: -1 })
                .lean();
        }
        return this.inventoryModel
            .find({ branch: user.branch })
            .populate('product', 'name  ')
            .populate('branch', 'name location')
            .populate('variants.variantId', 'name sku')
            .lean();
    }
    findImport(user) {
        console.log(user);
        if (user.role === roles_enum_1.RolesUser.Admin) {
            return this.movementModel
                .find({ type: transaction_enum_1.TransactionType.IMPORT })
                .populate('productId', 'name')
                .populate('branchId', 'name location')
                .populate('variants.variantId', 'name sku')
                .sort({ createdAt: -1 })
                .lean();
        }
        return this.movementModel
            .find({ branch: user.branch, type: transaction_enum_1.TransactionType.IMPORT })
            .populate('productId', 'name  ')
            .populate('branchId', 'name location')
            .populate('variants.variantId', 'name sku')
            .sort({ createdAt: -1 })
            .lean();
    }
    findExport(user) {
        if (user.role === roles_enum_1.RolesUser.Admin) {
            return this.movementModel
                .find({ type: transaction_enum_1.TransactionType.EXPORT })
                .populate('productId', 'name')
                .populate('branchId', 'name location')
                .populate('variants.variantId', 'name sku')
                .sort({ createdAt: -1 })
                .lean();
        }
        return this.movementModel
            .find({ branch: user.branch, type: transaction_enum_1.TransactionType.EXPORT })
            .populate('productId', 'name  ')
            .populate('branchId', 'name location')
            .populate('variants.variantId', 'name sku')
            .sort({ createdAt: -1 })
            .lean();
    }
    findOne(id) {
        return this.inventoryModel
            .findById(id)
            .populate('product', 'name')
            .populate('branch', 'name location')
            .lean();
    }
    async update(id, updateInventoryDto) {
        const inventoryExisting = await this.inventoryModel.findOne({ _id: id });
        if (!inventoryExisting) {
            throw new common_1.NotFoundException(`Không tìm thấy tồn kho với ID ${id}`);
        }
        return this.inventoryModel.findByIdAndUpdate({ _id: id }, updateInventoryDto, {
            new: true,
        });
    }
    async remove(id) {
        return await this.inventoryModel.softDelete({ _id: id }).then((result) => {
            if (!result) {
                throw new common_1.NotFoundException(`Không tìm thấy tồn kho với ID ${id}`);
            }
            return { message: 'Tồn kho đã được xóa thành công' };
        });
    }
    async importStock(dto, user) {
        const { branchId, productId, variants } = dto;
        let inventory = await this.inventoryModel.findOne({
            branch: branchId,
            product: productId,
        });
        if (!inventory) {
            inventory = await this.inventoryModel.create({
                branch: branchId,
                product: productId,
                variants: [],
                lastRestockedAt: new Date(),
                isActive: true,
                createdBy: {
                    email: user.email,
                    name: user.name,
                },
            });
            if (!inventory) {
                throw new common_1.BadRequestException('Không thể tạo tồn kho mới');
            }
        }
        variants.forEach(({ variantId, quantity, cost }) => {
            const variant = inventory.variants.find((v) => v.variantId.toString() === variantId);
            if (variant) {
                variant.stock += quantity;
            }
            else {
                inventory.variants.push({
                    variantId: new mongoose_2.default.Types.ObjectId(variantId),
                    stock: quantity,
                    cost: cost,
                });
            }
        });
        inventory.lastRestockedAt = new Date();
        await inventory.save();
        await this.movementModel.create({
            type: transaction_enum_1.TransactionType.IMPORT,
            branchId,
            productId,
            variants,
            source: transaction_enum_1.TransactionSource.MANUAL,
            createdBy: {
                email: user.email,
                name: user.name,
            },
        });
        return { message: 'Nhập kho thành công', inventory };
    }
    async getImportDetail(id) {
        return this.movementModel
            .findById(id)
            .populate('productId', 'name')
            .populate('branchId', 'name location')
            .populate('variants.variantId', 'name sku')
            .lean();
    }
    async getExportDetail(id) {
        return this.movementModel
            .findById(id)
            .populate('productId', 'name')
            .populate('branchId', 'name location')
            .populate('variants.variantId', 'name sku')
            .lean();
    }
    async getTransferDetail(id) {
        return this.transferModel
            .findById(id)
            .populate('fromBranchId', 'name location')
            .populate('toBranchId', 'name location')
            .populate('items.productId', 'name ')
            .populate('items.variantId', 'name sku')
            .lean();
    }
    async findTransfer() {
        return this.transferModel
            .find()
            .populate('fromBranchId', 'name location')
            .populate('toBranchId', 'name location')
            .populate('items.productId', 'name')
            .populate('items.variantId', 'name sku')
            .sort({ createdAt: -1 })
            .lean();
    }
    async exportStock(dto, user) {
        const { branchId, productId, variants } = dto;
        const inventory = await this.inventoryModel.findOne({
            branch: branchId,
            product: productId,
        });
        if (!inventory) {
            throw new common_1.NotFoundException('Không tìm thấy tồn kho');
        }
        for (const { variantId, quantity } of variants) {
            const variant = inventory.variants.find((v) => v.variantId.toString() === variantId);
            if (!variant || variant.stock < quantity) {
                throw new common_1.NotFoundException(`Tồn kho biến thể ${variantId} không đủ`);
            }
        }
        variants.forEach(({ variantId, quantity }) => {
            const variant = inventory.variants.find((v) => v.variantId.toString() === variantId);
            if (variant) {
                variant.stock -= quantity;
            }
        });
        await inventory.save();
        await this.movementModel.create({
            ...dto,
            type: transaction_enum_1.TransactionType.EXPORT,
            branchId,
            productId,
            variants,
            createdBy: {
                email: user.email,
                name: user.name,
            },
        });
        return { message: 'Xuất kho thành công', inventory };
    }
    async transferStock(createTransferDto, user) {
        const { items } = createTransferDto;
        await this.transferModel.create({
            ...createTransferDto,
            items: items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                unit: item.unit,
            })),
            status: transaction_enum_1.TransactionStatus.PENDING,
            createdBy: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
        });
        return { message: 'Chuyển kho thành công' };
    }
    async updateTransfer(id, updateTransferDto, user) {
        await this.transferModel.findByIdAndUpdate(id, { ...updateTransferDto });
        if (updateTransferDto.status === transaction_enum_1.TransactionStatus.RECEIVED) {
            for (const item of updateTransferDto.items) {
                console.log(item);
                await this.exportStock({
                    branchId: updateTransferDto.fromBranchId,
                    productId: item.productId,
                    source: transaction_enum_1.TransactionSource.TRANSFER,
                    variants: [
                        {
                            variantId: item.variantId,
                            quantity: item.quantity,
                        },
                    ],
                }, user);
                await this.importStock({
                    branchId: updateTransferDto.toBranchId,
                    productId: item.productId,
                    source: transaction_enum_1.TransactionSource.TRANSFER,
                    variants: [
                        {
                            variantId: item.variantId,
                            quantity: item.quantity,
                        },
                    ],
                }, user);
            }
        }
        return { message: 'Cập nhật chuyển kho thành công' };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Products.name)),
    __param(2, (0, mongoose_1.InjectModel)(stock_movement_schema_1.StockMovement.name)),
    __param(3, (0, mongoose_1.InjectModel)(transfer_schema_1.Transfer.name)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map