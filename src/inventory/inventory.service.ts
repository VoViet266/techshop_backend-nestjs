import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import path from 'path';
import { ProductDocument, Products } from 'src/product/schemas/product.schema';
import { Store } from 'src/store/schemas/store.schema';
import { console } from 'inspector';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<InventoryDocument>,
    @InjectModel(Products.name) // Assuming 'Products' is the name of the product model
    private readonly productModel: SoftDeleteModel<ProductDocument>, // Replace 'any' with the actual ProductDocument type if available
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const product = await this.productModel.findById(
      createInventoryDto.product,
    );
    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }
    const existingInventory = await this.inventoryModel.findOne({
      store: createInventoryDto.store,
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

  async findAll() {
    return await this.inventoryModel
      .find()
      .populate('product', 'name  ')
      .populate('store', 'name location')
      .lean();
  }

  findOne(id: string) {
    return this.inventoryModel
      .findById(id)
      .populate('product', 'name')
      .populate('store', 'name location')
      .lean();
  }

  update(id: string, updateInventoryDto: UpdateInventoryDto) {
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
        throw new BadRequestException(`Không tìm thấy tồn kho với ID ${id}`);
      }
      return { message: 'Tồn kho đã được xóa thành công' };
    });
  }
}
