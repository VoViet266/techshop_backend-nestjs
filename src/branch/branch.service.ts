import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectModel } from '@nestjs/mongoose';

import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';

@Injectable()
export class branchService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchModel: SoftDeleteModel<BranchDocument>,
  ) {}
  create(createBranchDto: CreateBranchDto) {
    const existingBranch = this.branchModel.findOne({
      name: createBranchDto.name,
    });
    // if (existingBranch) {
    //   throw new Error(
    //     `Branch with name ${createBranchDto.name} already exists`,
    //   );
    // }
    return this.branchModel.create(createBranchDto);
  }

  findAll() {
    return this.branchModel.find().sort({ createdAt: -1 }).exec();
  }

  findOne(id: string) {
    return this.branchModel.findById(id).exec();
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const storeExists = await this.branchModel.findById(id);
    if (!storeExists) {
      throw new Error(`branch with id ${id} does not exist`);
    }

    const updatedStore = await this.branchModel.updateOne(
      { _id: id },
      { $set: updateBranchDto },
      { new: true },
    );
    if (!updatedStore) {
      throw new Error(`Không thể cập nhật cửa hàng với id ${id}`);
    }
    return updatedStore;
  }

  remove(id: string) {
    const storeExists = this.branchModel.findById(id);
    if (!storeExists) {
      throw new Error(`branch with id ${id} does not exist`);
    }

    return this.branchModel.softDelete({ _id: id });
  }
}
