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
      !createInventoryDto.variant.every((variant) =>
        v.some((vItem) => vItem.variantId.toString() === variant.variantId),
      )
    ) {
      throw new BadRequestException(
        'Variant SKU không hợp lệ hoặc không khớp với sản phẩm',
      );
    }
    const inventoryData = {
      ...createInventoryDto,
      variants: createInventoryDto.variant.map((variant) => ({
        variantId: variant.variantId,
        quantity: variant.quantity,
        // price: variant.price || 0,
      })),
    };

    return await this.inventoryModel.create(inventoryData);
  }

  async findAll() {
    return await this.inventoryModel
      .find()
      .populate('product', 'name  ')
      .populate('store', 'name location')
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
