import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User as userModel } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { IUser } from './interface/user.interface';
import mongoose from 'mongoose';
import { Role, RoleDocument } from 'src/role/schemas/role.schema';
import { RolesUser } from 'src/constant/roles.enum';
import { console } from 'inspector';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(userModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: SoftDeleteModel<RoleDocument>,
  ) {}
  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto) {
    let roleId: any = createUserDto.role;
    if (!createUserDto.role) {
      const roleDefault = await this.roleModel.findOne({
        name: RolesUser.Customer,
      });
      console.log(roleDefault);
      if (!roleDefault) {
        throw new UnauthorizedException('Default role not found');
      }
      roleId = roleDefault._id;
    }

    const hashedPassword = this.hashPassword(createUserDto.password);
    return await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: roleId,
    });
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    const isExitEmail = await this.userModel.findOne({ email });
    if (isExitEmail) {
      throw new ConflictException(
        `Email: ${email} đã tồn tại trên hệ thống xin vui lòng chọn email khác`,
      );
    }
    const hashedPassword = this.hashPassword(password);

    let newRegister = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      address,
    });
    return newRegister;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken: refreshToken },
    );
  };
  findOne(id: string) {
    return this.userModel.findOne({ _id: id }).populate('role').exec();
  }
  findOneByEmail(username: string) {
    return this.userModel.findOne({ email: username });
  }
  findAll() {
    return this.userModel.find().populate({
      path: 'role',
      populate: {
        path: 'permissions',
      },
    });
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExist = await this.userModel.findOne({ _id: id });
    if (!userExist) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }
    if (updateUserDto.email && updateUserDto.email !== userExist.email) {
      const isExitEmail = await this.userModel.findOne({
        email: updateUserDto.email,
      });
      if (isExitEmail) {
        throw new UnauthorizedException(
          `Email: ${updateUserDto.email} đã tồn tại trên hệ thống xin vui lòng chọn email khác`,
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.hashPassword(updateUserDto.password);
    }

    return await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
  }

  findUserByRefreshToken = async (refresh_Token: string) => {
    const user = await this.userModel.findOne({
      refreshToken: refresh_Token,
    });
    return user;
  };

  async remove(id: string) {
    if (!id) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }
    const userExist = await this.userModel.findOne({ _id: id });
    if (!userExist) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }

    return await this.userModel.softDelete({ _id: id });
  }
}
