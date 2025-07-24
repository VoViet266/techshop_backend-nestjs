import {
  BadRequestException,
  Body,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Post,
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
import * as bcrypt from 'bcrypt';
import { IUser } from './interface/user.interface';
import mongoose from 'mongoose';
import { Role, RoleDocument } from 'src/role/schemas/role.schema';
import * as otpGenerator from 'otp-generator';
import Redis from 'ioredis';
import { MailService } from 'src/mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { populate } from 'dotenv';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(userModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly mailService: MailService,

    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}
  hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };
  isValidPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
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
  async register(registerDto: RegisterUserDto) {
    try {
      // Kiểm tra email đã tồn tại
      const existingUser = await this.userModel.findOne({
        email: registerDto.email,
      });

      if (existingUser) {
        throw new ConflictException('Email đã được sử dụng');
      }

      const hashedPassword = await this.hashPassword(registerDto.password);

      const tempUserData = {
        ...registerDto,
        password: hashedPassword,
      };

      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const tempUserKey = `temp_user:${registerDto.email}`;
      const otpKey = `otp:${registerDto.email}`;

      const pipeline = this.redisClient.pipeline();
      pipeline.setex(tempUserKey, 600, JSON.stringify(tempUserData)); // 10 phút
      pipeline.setex(otpKey, 600, otp); // 10 phút
      await pipeline.exec();

      await this.mailService.sendOtpEmail(registerDto.email, otp);

      return {
        success: true,
        message: 'Vui lòng kiểm tra email để nhận mã xác thực',
        email: registerDto.email,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Lỗi hệ thống khi đăng ký');
    }
  }

  async verifyOtp({ email, otp }: VerifyOtpDto) {
    try {
      const otpKey = `otp:${email}`;
      const tempUserKey = `temp_user:${email}`;

      const [storedOtp, tempUserData] = await Promise.all([
        this.redisClient.get(otpKey),
        this.redisClient.get(tempUserKey),
      ]);

      if (!storedOtp || !tempUserData) {
        throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn');
      }

      if (storedOtp !== otp) {
        throw new BadRequestException('Mã OTP không chính xác');
      }

      const userData = JSON.parse(tempUserData);

      const newUser = await this.userModel.create(userData);

      // Xóa dữ liệu tạm thời khỏi Redis
      const pipeline = this.redisClient.pipeline();
      pipeline.del(otpKey);
      pipeline.del(tempUserKey);
      await pipeline.exec();

      return {
        success: true,
        message: 'Xác thực thành công, tài khoản đã được tạo',
        user: {
          id: newUser._id,
          email: newUser.email,
          // Các thông tin khác cần thiết
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Lỗi hệ thống khi xác thực OTP');
    }
  }

  async resendOtp(email: string) {
    try {
      const tempUserKey = `temp_user:${email}`;
      const tempUserData = await this.redisClient.get(tempUserKey);

      if (!tempUserData) {
        throw new BadRequestException(
          'Không tìm thấy thông tin đăng ký, vui lòng đăng ký lại',
        );
      }

      // Tạo OTP mới
      const newOtp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      // Cập nhật OTP trong Redis
      const otpKey = `otp:${email}`;
      await this.redisClient.setex(otpKey, 600, newOtp); // 10 phút

      // Gửi OTP mới
      await this.mailService.sendOtpEmail(email, newOtp);

      return {
        success: true,
        message: 'Đã gửi lại mã OTP mới',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Lỗi hệ thống khi gửi lại OTP');
    }
  }

  // Thêm method để cleanup các OTP hết hạn (optional)
  async cleanupExpiredOtp() {
    try {
      const pattern = 'otp:*';
      const keys = await this.redisClient.keys(pattern);

      if (keys.length > 0) {
        await this.redisClient.del(keys);
      }
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
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
  async findAllUserHasPermission() {
    const users = await this.userModel
      .find()
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      })
      .populate('branch');

    // Ép kiểu để tránh TypeScript báo lỗi
    const usersWithPermissions = users.filter((user: any) => {
      return user.role?.permissions?.length > 0;
    });
    return usersWithPermissions;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
