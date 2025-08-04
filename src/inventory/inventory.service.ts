import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  CreateInventoryDto,
  CreateStockMovementDto,
  CreateTransferDto,
} from './dto/create-inventory.dto';
import {
  UpdateInventoryDto,
  UpdateTransferDto,
} from './dto/update-inventory.dto';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductDocument, Products } from 'src/product/schemas/product.schema';
import { Actions } from 'src/constant/permission.enum';
import { RolesUser } from 'src/constant/roles.enum';
import {
  StockMovement,
  StockMovementDocument,
} from './schemas/stock-movement.schema';
import { Transfer, TransferDocument } from './schemas/transfer.schema';
import mongoose, { Types } from 'mongoose';
import {
  TransactionSource,
  TransactionStatus,
  TransactionType,
} from 'src/constant/transaction.enum';
import { IUser } from 'src/user/interface/user.interface';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<InventoryDocument>,
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(StockMovement.name)
    private movementModel: SoftDeleteModel<StockMovementDocument>,
    @InjectModel(Transfer.name)
    private transferModel: SoftDeleteModel<TransferDocument>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto, user: IUser) {
    const product = await this.productModel.findById(
      createInventoryDto.product,
    );
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    const existingInventory = await this.inventoryModel.findOne({
      store: createInventoryDto.branch,
      product: createInventoryDto.product,
    });
    if (existingInventory) {
      throw new ConflictException('Sản phẩm đã tồn tại trong kho');
    }
    const v = product.variants.map((variant) => ({
      variantId: variant,
    }));
    if (
      !createInventoryDto.variants.every((variant) =>
        v.some((vItem) => vItem.variantId.toString() === variant.variantId),
      )
    ) {
      throw new BadRequestException(
        'Variant SKU không hợp lệ hoặc không khớp với sản phẩm',
      );
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
  async getStockProduct(
    productId: string,
    branchId: string,
    variantId: string,
  ) {
    const inventory = await this.inventoryModel
      .findOne(
        {
          product: productId,
          branch: branchId,
          'variants.variantId': variantId,
        },
        {
          variants: { $elemMatch: { variantId: variantId } },
        },
      )
      .lean();

    const stock = inventory?.variants?.[0]?.stock ?? 0;

    return stock;
  }

  async findAll(user: any) {
    if (user.role === RolesUser.Admin) {
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
      .sort({ createdAt: -1 })
      .lean();
  }
  findImport(user: any) {
    if (user.role === RolesUser.Admin) {
      return this.movementModel
        .find({ type: TransactionType.IMPORT })
        .populate('productId', 'name')
        .populate('branchId', 'name location')
        .populate('variants.variantId', 'name sku')
        .sort({ createdAt: -1 })
        .lean();
    }
    return this.movementModel
      .find({ branchId: user.branch, type: TransactionType.IMPORT })
      .populate('productId', 'name  ')
      .populate('branchId', 'name location')
      .populate('variants.variantId', 'name sku')
      .sort({ createdAt: -1 })
      .lean();
  }

  findExport(user: any) {
    if (user.role === RolesUser.Admin) {
      return this.movementModel
        .find({ type: TransactionType.EXPORT })
        .populate('productId', 'name')
        .populate('branchId', 'name location')
        .populate('variants.variantId', 'name sku')
        .sort({ createdAt: -1 })
        .lean();
    }
    return this.movementModel
      .find({ branchId: user.branch, type: TransactionType.EXPORT })
      .populate('productId', 'name  ')
      .populate('branchId', 'name location')
      .populate('variants.variantId', 'name sku')
      .sort({ createdAt: -1 })
      .lean();
  }

  findOne(id: string) {
    return this.inventoryModel
      .findById(id)
      .populate('product', 'name')
      .populate('branchId', 'name ')
      .lean();
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    const inventoryExisting = await this.inventoryModel.findOne({ _id: id });
    if (!inventoryExisting) {
      throw new NotFoundException(`Không tìm thấy tồn kho với ID ${id}`);
    }
    return this.inventoryModel.findByIdAndUpdate(
      { _id: id },
      updateInventoryDto,
      {
        new: true,
      },
    );
  }

  async remove(id: string) {
    return await this.inventoryModel.softDelete({ _id: id }).then((result) => {
      if (!result) {
        throw new NotFoundException(`Không tìm thấy tồn kho với ID ${id}`);
      }
      return { message: 'Tồn kho đã được xóa thành công' };
    });
  }

  async importStock(dto: CreateStockMovementDto, user: IUser) {
    const { branchId, productId, variants } = dto;
    let inventory = await this.inventoryModel.findOne({
      branch: branchId,
      product: productId,
    });

    if (!inventory) {
      // Tạo mới document Inventory nếu chưa có
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
        throw new BadRequestException('Không thể tạo tồn kho mới');
      }
    }

    // Cập nhật variants
    variants.forEach(({ variantId, variantColor, quantity, cost }) => {
      const variant = inventory.variants.find(
        (v) => v.variantId.toString() === variantId,
      );

      if (variant) {
        variant.stock += quantity;
      } else {
        inventory.variants.push({
          variantId: new mongoose.Types.ObjectId(variantId),
          variantColor: variantColor,
          stock: quantity,
          cost: cost,
        });
      }
    });

    inventory.lastRestockedAt = new Date();

    await inventory.save();
    await this.movementModel.create({
      type: TransactionType.IMPORT,
      branchId,
      productId,
      variants,
      source: TransactionSource.MANUAL,
      createdBy: {
        email: user.email,
        name: user.name,
      },
    });
    return { message: 'Nhập kho thành công', inventory };
  }

  async getImportDetail(id: string) {
    return this.movementModel
      .findById(id)
      .populate('productId', 'name')
      .populate('branchId', 'name location')
      .populate('variants.variantId', 'name sku')
      .lean();
  }

  async getExportDetail(id: string) {
    return this.movementModel
      .findById(id)
      .populate('productId', 'name')
      .populate('branchId', 'name location')
      .populate('variants.variantId', 'name sku')
      .lean();
  }

  async getTransferDetail(id: string) {
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

  async exportStock(dto: CreateStockMovementDto, user: any) {
    const { branchId, productId, variants } = dto;

    const inventory = await this.inventoryModel.findOne({
      branch: branchId,
      product: productId,
    });

    if (!inventory) {
      throw new NotFoundException('Không tìm thấy tồn kho');
    }

    for (const { variantId, quantity } of variants) {
      const variant = inventory.variants.find(
        (v) => v.variantId.toString() === variantId,
      );
      if (!variant || variant.stock < quantity) {
        throw new NotFoundException(`Tồn kho biến thể ${variantId} không đủ`);
      }
    }

    // Trừ tồn kho
    variants.forEach(({ variantId, quantity }) => {
      const variant = inventory.variants.find(
        (v) => v.variantId.toString() === variantId,
      );
      // nếu variant tồn tại thì trừ đi số lượng tồn kho
      if (variant) {
        variant.stock -= quantity;
      }
    });

    await inventory.save();
    await this.movementModel.create({
      ...dto,
      type: TransactionType.EXPORT,
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

  async transferStock(createTransferDto: CreateTransferDto, user: IUser) {
    const { items } = createTransferDto;

    await this.transferModel.create({
      ...createTransferDto,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unit: item.unit,
      })),

      status: TransactionStatus.PENDING,
      createdBy: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
    return { message: 'Chuyển kho thành công' };
  }

  async updateTransfer(
    id: string,
    updateTransferDto: UpdateTransferDto,
    user: IUser,
  ) {
    await this.transferModel.findByIdAndUpdate(id, { ...updateTransferDto });

    if (updateTransferDto.status === TransactionStatus.RECEIVED) {
      for (const item of updateTransferDto.items) {
        console.log(item);
        await this.exportStock(
          {
            branchId: updateTransferDto.fromBranchId,
            productId: item.productId,
            source: TransactionSource.TRANSFER,
            variants: [
              {
                variantId: item.variantId,
                variantColor: item.variantColor,
                quantity: item.quantity,
              },
            ],
          },
          user,
        );

        await this.importStock(
          {
            branchId: updateTransferDto.toBranchId,
            productId: item.productId,
            source: TransactionSource.TRANSFER,
            variants: [
              {
                variantId: item.variantId,
                variantColor: item.variantColor,
                quantity: item.quantity,
              },
            ],
          },
          user,
        );
      }
    }

    return { message: 'Cập nhật chuyển kho thành công' };
  }
}
