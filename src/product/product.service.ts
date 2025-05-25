import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Cameras,
  CamerasDocument,
  Connectivities,
  ConnectivitiesDocument,
  Products,
  ProductDocument,
  Variants,
  VariantDocument,
} from './schemas/product.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Products.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    @InjectModel(Variants.name)
    private readonly variantModel: SoftDeleteModel<VariantDocument>,
    @InjectModel(Connectivities.name)
    private readonly connectivitiesModel: SoftDeleteModel<ConnectivitiesDocument>,
    @InjectModel(Cameras.name)
    private readonly camerasModel: SoftDeleteModel<CamerasDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const createdCamera = await this.camerasModel.create({
      ...createProductDto.cameras,
    });
    const createdConnectivity = await this.connectivitiesModel.create({
      ...createProductDto.connectivities,
    });
    const createdVariants = await this.variantModel.insertMany(
      createProductDto.variants,
    );

    return this.productModel.create({
      ...createProductDto,
      cameras: createdCamera._id,
      connectivities: createdConnectivity._id,
      variants: createdVariants.map((variant) => variant._id),
    });
  }

  async findAll() {
    return this.productModel
      .find()
      .populate({
        path: 'variants',
        model: Variants.name,
        select: {
          _id: 0,
          
          name: 1,
          price: 1,
          color: 1,
          ram: 1,
          stock: 1,
          storage: 1,
          image: 1,
        },
      })
      .populate({
        path: 'connectivities',
        model: Connectivities.name,
        select: {
          _id: 0,
       
          wifi: 1,
          bluetooth: 1,
          network: 1,
          nfc: 1,
          gps: 1,
          usb: 1,
        },
      })
      .populate({
        path: 'cameras',
        model: Cameras.name,
        select: {
          _id: 0,
          
          frontCamera: 1,
          rearCamera: 1,
          videoRecording: 1,
        },
      });
  }

  async findOne(id: string) {
    return this.productModel.findById(id);
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
