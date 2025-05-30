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
import aqp from 'api-query-params';
import { Category } from 'src/category/schemas/category.schema';
import { Brand } from 'src/brand/schemas/brand.schema';

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
  // async autocompleteSearch(query: string) {
  //   const result = await this.productModel.aggregate([
  //     {
  //       $search: {
  //         index: 'product_search',
  //         compound: {
  //           should: [
  //             {
  //               autocomplete: {
  //                 query: query,
  //                 path: ['name', 'description', 'tags'],
  //                 fuzzy: { maxEdits: 1, prefixLength: 1 },
  //                 tokenOrder: 'sequential',
  //               },
  //             },
  //             {
  //               text: {
  //                 query: query,
  //                 path: 'description',
  //                 fuzzy: { maxEdits: 1 },
  //               },
  //             },
  //           ],
  //           minimumShouldMatch: 1, // Ít nhất 1 điều kiện phải đúng
  //         },
  //       },
  //     },
  //     { $limit: 10 },
  //     // {
  //     //   $lookup: {
  //     //     from: 'categories',
  //     //     localField: 'category',
  //     //     foreignField: '_id',
  //     //     as: 'category',
  //     //   },
  //     // },
  //     // {
  //     //   $lookup: {
  //     //     from: 'brands',
  //     //     localField: 'brand',
  //     //     foreignField: '_id',
  //     //     as: 'brand',
  //     //   },
  //     // },
  //     // {
  //     //   $project: {
  //     //     name: 1,
  //     //     description: 1,
  //     //     price: 1,
  //     //     stock: 1,
  //     //     discount: 1,
  //     //     images: 1,
  //     //     // category: {
  //     //     //   _id: { $arrayElemAt: ['$category._id', 0] },
  //     //     //   name: { $arrayElemAt: ['$category.name', 0] },
  //     //     // },
  //     //     // brand: {
  //     //     //   _id: { $arrayElemAt: ['$brand._id', 0] },
  //     //     //   name: { $arrayElemAt: ['$brand.name', 0] },
  //     //     //   description: { $arrayElemAt: ['$brand.description', 0] },
  //     //     //   logo: { $arrayElemAt: ['$brand.logo', 0] },
  //     //     // },
  //     //     variant: 1,
  //     //   },
  //     // },
  //   ]);

  //   return result;
  // }

  async findAll(currentPage: number, limit: number, qs: string) {
    console.log(currentPage, limit);
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit;

    let result: object[];
    let totalItems: number;

    if (filter.category || filter.brand) {
      const matchConditions: any = {};

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
            from: Category.name,
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: Brand.name,
            localField: 'brand',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $lookup: {
            from: Variant.name,
            localField: 'variants',
            foreignField: '_id',
            as: 'variant',
          },
        },
        { $match: matchConditions },
        {
          $project: {
            name: 1,
            description: 1,
            discount: 1,
            category: {
              _id: { $arrayElemAt: ['$category._id', 0] },
              name: { $arrayElemAt: ['$category.name', 0] },
            },
            brand: {
              _id: { $arrayElemAt: ['$brand._id', 0] },
              name: { $arrayElemAt: ['$brand.name', 0] },
              description: { $arrayElemAt: ['$brand.description', 0] },
              logo: { $arrayElemAt: ['$brand.logo', 0] },
            },

            variant: {
              _id: { $arrayElemAt: ['$variants._id', 0] },
              color: { $arrayElemAt: ['$variants.color', 0] },
              size: { $arrayElemAt: ['$variants.size', 0] },
              stock: { $arrayElemAt: ['$variants.stock', 0] },
              price: { $arrayElemAt: ['$variants.price', 0] },
              images: { $arrayElemAt: ['$variants.images', 0] },
            },
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
        .populate('variants')
        .populate('category', 'name')
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

  async findOneBySlug(sl: string) {
    return await this.productModel.findOne({ slug: sl }).populate({
      path: 'variants',
      select: 'name price color memory images',
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
