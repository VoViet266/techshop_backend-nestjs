import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductDocument, Products } from 'src/product/schemas/product.schema';
import { Actions } from 'src/constant/permission.enum';
import { RolesUser } from 'src/constant/roles.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<InventoryDocument>,
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
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
        cost: variant.cost,
      })),
    };

    return await this.inventoryModel.create(inventoryData);
  }

  // async findAll() {
  //   return await this.inventoryModel
  //     .find()
  //
  // }
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
}
