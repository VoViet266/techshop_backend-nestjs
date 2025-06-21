import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel: SoftDeleteModel<BrandDocument>,
  ) {}

  create(createBrandDto: CreateBrandDto) {
    const existingBrand = this.brandModel.findOne({
      name: createBrandDto.name,
    });
    if (existingBrand) {
      throw new Error(`Brand with name ${createBrandDto.name} already exists`);
    }
    return this.brandModel.create(createBrandDto);
  }

  findAll() {
    return this.brandModel.find().lean();
  }

  async findOne(id: number) {
    return this.brandModel
      .findById(id)
      .exec()
      .then((brand) => {
        if (!brand) {
          throw new Error(`Brand with id ${id} not found`);
        }
        return brand;
      });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const existingBrand = await this.brandModel.findById(id);
    if (!existingBrand) {
      throw new Error(`Brand with id ${id} does not exist`);
    }
    return this.brandModel.updateOne(
      { _id: id },
      { $set: updateBrandDto },
      { new: true, runValidators: true },
    );
  }

  async remove(id: number) {
    return this.brandModel.deleteOne({ _id: id }).then((result) => {
      if (result.deletedCount === 0) {
        throw new Error(`Brand with id ${id} does not exist`);
      }
      return { message: 'Brand deleted successfully' };
    });
  }
}
