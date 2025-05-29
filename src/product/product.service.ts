import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectivitiesDocument,
  Products,
  ProductDocument,
  VariantDocument,
  Variant,
} from './schemas/product.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Inventory,
  InventoryDocument,
} from 'src/inventory/schemas/inventory.schema';
import { console } from 'inspector';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(Variant.name)
    private readonly variantModel: SoftDeleteModel<VariantDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<InventoryDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const createdVariants = await this.variantModel.insertMany(
      createProductDto.variants,
    );
    const slug = slugify(createProductDto.name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
    const createdProduct = await this.productModel.create({
      ...createProductDto,
      slug: slug,
      variants: createdVariants.map((variant) => variant._id),
    });
    return createdProduct;
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOneById(id: string) {
    return (await this.productModel.findById({ _id: id })).populate({
      path: 'variants',
      select: 'name price color memory',
    });
  }

  async findOneBySlug(sl: string) {
    return await this.productModel.findOne({ slug: sl }).populate({
      path: 'variants',
      select: 'name price color memory',
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
