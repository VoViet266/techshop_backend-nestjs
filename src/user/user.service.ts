import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  RegisterUserDto,
} from './dto/create-user.dto';
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
import { populate } from 'dotenv';

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
    // if (!createUserDto.role) {
    //   const roleDefault = await this.roleModel.findOne({
    //     name: RolesUser.Customer,
    //   });
    //   if (!roleDefault) {
    //     throw new NotFoundException('Không tìm thấy quyền');
    //   }
    //   roleId = roleDefault._id;
    // }

    const hashedPassword = this.hashPassword(createUserDto.password);
    return await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: roleId,
    });
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, addresses, phone } = user;
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
      phone,
      addresses,
    });
    return newRegister;
  }

  changePassword = async (changePassword: ChangePasswordDto, user: IUser) => {
    const userExist = await this.userModel.findById(user._id);
    if (!userExist) {
      throw new NotFoundException('User không tồn tại');
    }
    const isMatch = this.isValidPassword(
      changePassword.oldPassword,
      userExist.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu cũ không chính xác');
    }
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      throw new ConflictException(
        'Mật khẩu mới và xác nhận mật khẩu không khớp',
      );
    }
    const hashedNewPassword = this.hashPassword(changePassword.newPassword);
    await this.userModel.updateOne(
      { _id: user._id },
      { password: hashedNewPassword },
    );
    return 'Mật Khẩu đã cập nhật thành công';
  };

  updateUserToken = async (id: string, refreshToken: string) => {
    await this.userModel.updateOne({ _id: id }, { refreshToken: refreshToken });
    return true;
  };
  findOne(id: string) {
    return this.userModel
      .findOne({ _id: id })
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      })
      .exec();
  }
  findOneByID(id: string) {
    return this.userModel.findById(id);
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
    console.log(updateUserDto);
    const userExist = await this.userModel.findOne({ _id: id });
    if (!userExist) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (updateUserDto.email && updateUserDto.email !== userExist.email) {
      const isExitEmail = await this.userModel.findOne({
        email: updateUserDto.email,
      });
      if (isExitEmail) {
        throw new NotFoundException(
          `Email: ${updateUserDto.email} đã tồn tại trên hệ thống xin vui lòng chọn email khác`,
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.hashPassword(updateUserDto.password);
    }

    return await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
  }

  async updateRole(id: string, role: string) {
    const userExist = await this.userModel.findOne({ _id: id });
    if (!userExist) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return await this.userModel.updateOne({ _id: id }, { role: role });
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
