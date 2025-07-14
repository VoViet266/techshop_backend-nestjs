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
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,

    private mailService: MailService, // Assuming MailService is part of UserService

    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService
      .findOneByEmail(username)
      .populate({
        path: 'role',
        populate: { path: 'permissions', select: 'module action' },
      })
      .exec();
    if (user) {
      const isValid = this.userService.isValidPassword(pass, user.password);
      console.log('isValid', isValid);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async createAccessToken(payload: any) {
    return this.jwtService.sign(payload);
  }
  async login(user: IUser, res: Response) {
    const { _id, name, email, avatar } = user;
    console.log('user', user);
    const userWithRole = await (
      await this.userService.findOneByID(user._id)
    ).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        select: 'name module action',
      },
    });
    const role: any = userWithRole.role;

    const roleName = role?.name;
    const permission = role?.permissions?.map((per: any) => ({
      name: per.name,
      module: per.module,
      action: per.action,
    }));

    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      avatar,
      branch: user.branch,
      role: roleName,
      permission: permission,
    };

    const refresh_Token = this.createRefreshToken({ payload });
    await this.userService.updateUserToken(_id, refresh_Token);

    res.clearCookie('refresh_Token');
    res.cookie('refresh_Token', refresh_Token, {
      httpOnly: true,
      secure: false,
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'strict',
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      avatar,
      branch: user.branch,
      role: roleName,
      permission: permission,
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
      let decoded: any;
      try {
        decoded = this.jwtService.verify(refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        });
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new UnauthorizedException(
            'Refresh Token đã hết hạn. Đăng nhập lại.',
          );
        }
        throw new BadRequestException('Refresh Token không hợp lệ.');
      }
      const userDoc =
        await this.userService.findUserByRefreshToken(refreshToken);

      if (!userDoc) {
        throw new UnauthorizedException(
          'Không tìm thấy người dùng với refresh token.',
        );
      }

      const user = await userDoc.populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      });

      const role: any = user.role;
      const roleName = role?.name;
      const permission = role?.permissions?.map((per: any) => per.name);
      const payload = {
        sub: 'token login',
        iss: 'from server',
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        branch: user.branch,
        role: roleName,
        permission: permission,
      };

      const newRefreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
      });

      await this.userService.updateUserToken(
        user._id.toString(),
        newRefreshToken,
      );
      res.clearCookie('refresh_Token');
      res.cookie('refresh_Token', newRefreshToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite:
          this.configService.get<string>('NODE_ENV') === 'production'
            ? 'none'
            : 'strict',
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      });

      return {
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
        }),
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        branch: user.branch,
        role: roleName,
        permission: permission,
      };
    } catch (error) {
      throw error;
    }
  };
  async logout(res: Response, user: IUser) {
    await this.userService.updateUserToken(user._id.toString(), null);
    res.clearCookie('refresh_Token');
    return {
      message: 'Đăng xuất thành công',
    };
  }

  // forgot password
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Email không tồn tại trong hệ thống.');
    }
    const token = randomBytes(3).toString('hex');

    const expiresAt = new Date();

    expiresAt.toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    /// Token có thời hạn 5 phút
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiresAt;
    await user.save();
    await this.mailService.sendResetPasswordEmail(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
    });

    if (!user) {
      throw new BadRequestException('Token không hợp lệ.');
    }

    if (
      user.resetPasswordExpires &&
      user.resetPasswordExpires.getTime() <= Date.now()
    ) {
      await this.userModel.updateOne(
        { resetPasswordToken: token },
        {
          $unset: {
            resetPasswordToken: 1,
            resetPasswordExpires: 1,
          },
        },
      );
      throw new BadRequestException('Token hết hạn.');
    }

    if (newPassword.length < 8) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 8 ký tự.');
    }

    const hashedPassword = this.userService.hashPassword(newPassword);

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetPasswordToken: 1,
          resetPasswordExpires: 1,
        },
      },
    );
    await this.userService.updateUserToken(user._id.toString(), null);
    console.log('Mật khẩu đã được cập nhật thành công.');
  }
}
