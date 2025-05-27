import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/user/interface/user.interface';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

import { randomBytes, randomUUID } from 'crypto';

import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserService } from 'src/user/user.service';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,

   
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(username);

    if (user) {
      const isValid = this.userService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }
  async login(user: IUser, res: Response) {
    const { _id, name, email, avatar } = user;

    const user_role = await (
      await this.userService.findOne(user._id)
    ).populate({
      path: 'role',
      populate: {
        path: 'permissions',
      },
    });

    const roleName = user_role.role.map((role: any) => role.name);
    console.log(roleName);
    const permission = user_role.role.flatMap((role: any) =>
      role.permissions.map((per: any) => per.name),
    );
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      avatar,
      role: {
        roleName,
        permission: permission,
      },
    };

    const refresh_Token = this.createRefreshToken({
      payload,
    });

    await this.userService.updateUserToken(refresh_Token, _id);

    res.cookie('refresh_Token', refresh_Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // bật secure nếu là môi trường production
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'strict', // bật sameSite nếu là môi trường production
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      avatar,
      role: {
        roleName,
        permission: permission,
      },
    };
  }

  async register(user: RegisterUserDto) {
    const User = await this.userService.register(user);
    return {
      _id: User?._id,
      createdAt: User?.createdAt,
    };
  }

  createRefreshToken = (payload: object) => {
    const refresh_Token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_Token;
  };

  refreshToken = async (refreshToken: string, res: Response) => {
    try {
      // Xác thực refresh token
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      // Tìm user theo refresh token
      const user = await this.userService.findUserByRefreshToken(refreshToken);
      if (!user) {
        return null;
      }

      // Lấy thông tin role và permission của user
      const userWithRole = await (
        await this.userService.findOne(user._id.toString())
      ).populate({
        path: 'roleID',
        populate: {
          path: 'permissions',
        },
      });

      const roleName = userWithRole.role.map((role: any) => role.name);
      const permission = userWithRole.role.flatMap((role: any) =>
        role.permissions.map((per: any) => per.name),
      );

      // Tạo payload cho token
      const payload = {
        sub: 'token login',
        iss: 'from server',
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: {
          roleName,
          permission,
        },
      };

      // Tạo refresh token mới
      const newRefreshToken = this.createRefreshToken({ payload });

      // Lưu refresh token mới vào DB
      await this.userService.updateUserToken(
        newRefreshToken,
        user._id.toString(),
      );

      // Xóa và gán lại cookie refresh token
      res.clearCookie('refresh_Token');

      res.cookie('refresh_Token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // bật secure nếu là môi trường production
        sameSite:
          this.configService.get<string>('NODE_ENV') === 'production'
            ? 'none'
            : 'strict',
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      });

      // Trả về access token mới và thông tin user
      return {
        access_token: this.jwtService.sign(payload),
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: {
          roleName,
          permission,
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Refresh Token đã hết hạn. Đăng nhập lại.',
        );
      }
      throw new BadRequestException('Refresh Token không hợp lệ.');
    }
  };
  async logout(res: Response, user: IUser) {
    await this.userService.updateUserToken('', user._id);
    res.clearCookie('refresh_Token');
    return {
      message: 'Đăng xuất thành công',
    };
  }


}
