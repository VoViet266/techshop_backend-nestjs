import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name)
    private readonly storeModel: SoftDeleteModel<StoreDocument>,
  ) {}
  create(createStoreDto: CreateStoreDto) {
    // Check if a store with the same name already exists
    const existingStore = this.storeModel.findOne({
      name: createStoreDto.name,
    });
    if (existingStore) {
      throw new Error(`Store with name ${createStoreDto.name} already exists`);
    }
    return this.storeModel.create(createStoreDto);
  }

  findAll() {
    return this.storeModel.find().sort({ createdAt: -1 }).exec();
  }

  findOne(id: string) {
    return this.storeModel.findById(id).exec();
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const storeExists = await this.storeModel.findById(id);
    if (!storeExists) {
      throw new Error(`Store with id ${id} does not exist`);
    }

    const updatedStore = await this.storeModel.updateOne(
      { _id: id },
      { $set: updateStoreDto },
      { new: true },
    );
    if (!updatedStore) {
      throw new Error(`Không thể cập nhật cửa hàng với id ${id}`);
    }
    return updatedStore;
  }

  remove(id: string) {
    const storeExists = this.storeModel.findById(id);
    if (!storeExists) {
      throw new Error(`Store with id ${id} does not exist`);
    }

    return this.storeModel.softDelete({ _id: id });
  }
}
