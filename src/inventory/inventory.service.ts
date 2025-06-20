import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateInventoryDto,
  CreateStockMovementDto,
  CreateTransferDto,
} from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
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

  async findAll(user: any) {
    if (user.role?.roleName === RolesUser.Admin) {
      return this.inventoryModel
        .find()
        .populate('product', 'name')
        .populate('branch', 'name location')
        .populate('variants.variantId', 'name sku') // Populate the variantId field inside variants
        .lean();
    }
    return this.inventoryModel
      .find({ branch: user.branch })
      .populate('product', 'name  ')
      .populate('branch', 'name location')
      .populate('variants.variantId', 'name sku')
      .lean();
  }
  findImport(user: any) {
    if (user.role?.roleName === RolesUser.Admin) {
      return this.movementModel
        .find({ type: TransactionType.IMPORT })
        .populate('productId', 'name')
        .populate('branchId', 'name location')
        .populate('variants.variantId', 'name sku')
        .lean();
    }
    return this.movementModel
      .find({ branch: user.branch, type: TransactionType.IMPORT })
      .populate('productId', 'name  ')
      .populate('branchId', 'name location')
      .populate('variants.variantId', 'name sku')
      .lean();
  }

  findExport(user: any) {
    if (user.role?.roleName === RolesUser.Admin) {
      return this.movementModel
        .find({ type: TransactionType.EXPORT })
        .populate('productId', 'name')
        .populate('branchId', 'name location')
        .populate('variants.variantId', 'name sku')
        .lean();
    }
    return this.movementModel
      .find({ branch: user.branch, type: TransactionType.EXPORT })
      .populate('productId', 'name  ')
      .populate('branchId', 'name location')
      .populate('variants.variantId', 'name sku')
      .lean();
  }

  findOne(id: string) {
    return this.inventoryModel
      .findById(id)
      .populate('product', 'name')
      .populate('branch', 'name location')
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
    variants.forEach(({ variantId, quantity, cost }) => {
      const variant = inventory.variants.find(
        (v) => v.variantId.toString() === variantId,
      );

      if (variant) {
        variant.stock += quantity;
      } else {
        inventory.variants.push({
          variantId: new mongoose.Types.ObjectId(variantId),
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

  async exportStock(dto: CreateStockMovementDto, user: IUser) {
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
    const { fromBranchId, toBranchId, items } = createTransferDto;
    const productId = items[0].productId; // Extract productId from the first item
    const variants = items.map((item) => ({
      variantId: item.variant.toString(),
      quantity: item.quantity,
    }));

    // // Xuất kho từ chi nhánh gửi
    const exportStock = await this.exportStock(
      {
        branchId: fromBranchId,
        productId,
        variants,
      },
      user,
    );
    if (!exportStock) {
      throw new BadRequestException('Không thể xuất kho từ chi nhánh gửi');
    }

    // // Nhập kho chi nhánh nhận

    const importStock = await this.importStock(
      {
        branchId: toBranchId,
        productId,
        variants,
      },
      user,
    );
    if (!importStock) {
      throw new BadRequestException('Không thể nhập kho vào chi nhánh nhận');
    }

    await this.transferModel.create({
      ...createTransferDto,
      items: items.map((item) => ({
        productId: item.productId,
        variant: item.variant,
        quantity: item.quantity,
      })),
      status: TransactionStatus.RECEIVED,
      createdBy: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
    return { message: 'Chuyển kho thành công' };
  }
}
