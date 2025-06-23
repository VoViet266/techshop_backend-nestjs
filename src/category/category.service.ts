import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: SoftDeleteModel<CategoryDocument>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryModel
      .findOne({
        name: createCategoryDto.name,
      })
      .lean();
    if (existingCategory) {
      throw new Error(
        `Category with name ${createCategoryDto.name} already exists`,
      );
    }
    return this.categoryModel.create(createCategoryDto);
  }

  findAll() {
    return this.categoryModel.find().sort({ createdAt: -1 }).lean();
  }

  findOne(id: string) {
    return this.categoryModel.findById(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.categoryModel.findById(id).lean();
    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} does not exist`);
    }

    const result = await this.categoryModel
      .findByIdAndUpdate(
        id,
        { $set: updateCategoryDto },
        {
          new: true, // Trả về dữ liệu đã cập nhật
          runValidators: true,
        },
      )
      .lean(); // Trả về plain object nếu bạn không cần document Mongoose

    return result;
  }

  async remove(id: string) {
    const existingCategory = await this.categoryModel.findById(id).lean();
    if (!existingCategory) {
      throw new ConflictException(`Category with id ${id} does not exist`);
    }
    return this.categoryModel.deleteOne({ _id: id }).then((result) => {
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Category with id ${id} does not exist`);
      }
      return { message: 'Category deleted successfully' };
    });
  }
}
