import { BadRequestException, Get, Injectable, Param } from '@nestjs/common';
import * as fs from 'fs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Products, ProductDocument } from './schemas/product.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Inventory,
  InventoryDocument,
} from 'src/inventory/schemas/inventory.schema';
import { console } from 'inspector';
import slugify from 'slugify';
import aqp from 'api-query-params';
import { Variant, VariantDocument } from './schemas/variant.schema';
import { Brand, BrandDocument } from 'src/brand/schemas/brand.schema';
import {
  Category,
  CategoryDocument,
} from 'src/category/schemas/category.schema';
import * as mongooseDelete from 'mongoose-delete';
import csvParser from 'csv-parser';
import { ImportProductFromCsvDto } from './dto/import-product.dto';
import { ReviewService } from 'src/review/review.service';
import { Public } from 'src/decorator/publicDecorator';

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
      createProductDto?.variants?.map((variant) => ({
        ...variant,
      })),
    );
    const slug = slugify(createProductDto.name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
    const createdProduct = await this.productModel.create({
      ...createProductDto,
      slug: slug,
      variants: createdVariants?.map((variant) => variant._id) || [],
    });
    return createdProduct;
  }

  async insertManyProduct(createProductDtos: CreateProductDto[]) {
    const productsToInsert = await Promise.all(
      createProductDtos.map(async (createProductDto) => {
        const createdVariants = await this.variantModel.insertMany(
          createProductDto.variants.map((variant) => ({
            ...variant,
            compareAtPrice:
              variant.price + (variant.price * createProductDto.discount) / 100,
          })),
        );
        const slug = slugify(createProductDto.name, {
          lower: true,
          strict: true,
          locale: 'vi',
        });
        return {
          ...createProductDto,
          slug: slug,
          variants: createdVariants.map((variant) => variant._id),
        };
      }),
    );
    const createdProducts =
      await this.productModel.insertMany(productsToInsert);
    return createdProducts;
  }

  async autocompleteSearch(query: string) {
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

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.page;
    delete filter.limit;
    filter.isDeleted = false;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit;

    let result: object[];
    let totalItems: number;

    if (filter.category || filter.brand) {
      const matchConditions: any = {
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

      const aggregateResults =
        await this.productModel.aggregate(aggregatePipeline);
      result = aggregateResults[0].data;
      totalItems = aggregateResults[0].totalItems[0]?.count || 0;
    } else {
      totalItems = await this.productModel.countDocuments(filter);
      result = await this.productModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any)
        .populate(population)
        .populate('variants', 'name price color memory images')
        .populate('category', 'name description')
        .populate('brand', 'name description logo')
        .exec();
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

  async findOneById(id: string) {
    return await this.productModel.findById({ _id: id }).populate({
      path: 'variants',
      select: 'name price color memory images',
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    const variantIds: string[] = [];
    await Promise.all(
      updateProductDto.variants.map(async (variant, index) => {
        if (product.variants[index]) {
          const existingVariantId = product.variants[index];
          const updated = await this.variantModel.findByIdAndUpdate(
            existingVariantId,
            {
              ...variant,
            },
            { new: true },
          );
          if (!updated) {
            throw new BadRequestException(
              `Không tìm thấy biến thể với ID ${existingVariantId}`,
            );
          }
          variantIds.push(updated._id.toString());
        } else {
          const created = await this.variantModel.create({
            ...variant,
          });
          variantIds.push(created._id.toString());
        }
      }),
    );

    if (product.variants.length > variantIds.length) {
      const toDelete = product.variants.slice(variantIds.length);
      await this.variantModel.deleteMany({ _id: { $in: toDelete } });
    }

    await this.productModel.updateOne(
      { _id: id },
      {
        ...updateProductDto,
        attributes: updateProductDto.attributes,
        variants: variantIds,
      },
    );

    return { message: 'Cập nhật thành công' };
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }
    // Kiểm tra xem sản phẩm có tồn tại trong kho không
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
}
