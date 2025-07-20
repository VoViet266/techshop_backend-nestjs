import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import mongoose from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    let role = await this.roleModel.create({
      ...createRoleDto,
    });

    return role;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }

  findAll() {
    return this.roleModel.find().populate({
      path: 'permissions',
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new Error('Role not found');

    const currentPermissions = new Set(
      role.permissions.map((p) => p.toString()),
    );
    const newPermissions = new Set(updateRoleDto.permissions);

    const permissionsToAdd: string[] = [];
    const permissionsToRemove: string[] = [];

    for (const p of newPermissions) {
      if (!currentPermissions.has(p)) {
        permissionsToAdd.push(p);
      }
    }

    for (const p of currentPermissions) {
      if (!newPermissions.has(p)) {
        permissionsToRemove.push(p);
      }
    }


    if (permissionsToRemove.length) {
      await this.roleModel.updateOne(
        { _id: id },
        { $pull: { permissions: { $in: permissionsToRemove } } },
      );
    }

  
    if (permissionsToAdd.length) {
      await this.roleModel.updateOne(
        { _id: id },
        { $addToSet: { permissions: { $each: permissionsToAdd } } },
      );
    }
    await this.roleModel.updateOne(
      { _id: id },
      { $set: { updatedAt: new Date() } },
    );

    return { success: true };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found role');
    }
    return (await this.roleModel.findById(id)).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
  }

  remove(id: string) {
    return this.roleModel.deleteOne({ _id: id });
  }
}
