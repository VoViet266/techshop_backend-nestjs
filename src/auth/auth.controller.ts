import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ResponseMessage } from 'src/decorator/messageDecorator';
import { IUser } from 'src/user/interface/user.interface';
import { User } from 'src/decorator/userDecorator';
import { Public } from 'src/decorator/publicDecorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage('Lấy thông tin tài khoản thành công')
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return {
      user,
    };
  }
  // @ResponseMessage('Lấy Refresh Token thành công')
  // @Get('/refresh')
  // @Public()
  // handleRefreshToken(
  //   @Req() request: Request & { cookies: { [key: string]: string } },
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const refreshToken = request.cookies['refresh_Token'];
  //   return this.authService.refreshToken(refreshToken, res);
  // }
  // @ResponseMessage('Đăng xuất thành công')
  // @Get('/logout')
  // handleLogout(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
  //   return this.authService.logout(res, user);
  // }

  // @Post('forgot-password')
  // @ResponseMessage('Mât khẩu đã được đặt lại, vui lòng kiểm tra email.')
  // @Public()
  // async forgotPassword(@Body('email') email: string) {
  //   if (!email) {
  //     throw new BadRequestException('Email là trường bắt buộc.');
  //   }

  //   await this.authService.forgotPassword(email);
  //   return;
  // }

  // @Post('reset-password')
  // @ResponseMessage('Mật khẩu đã được đặt lại thành công.')
  // @Public()
  // async resetPassword(
  //   @Body('token') token: string,
  //   @Body('password') password: string,
  // ) {
  //   if (!token || !password) {
  //     throw new BadRequestException(
  //       'Token và mật khẩu mới là các trường bắt buộc.',
  //     );
  //   }

  //   if (password.length < 8) {
  //     throw new BadRequestException('Mật khẩu phải có ít nhất 8 ký tự.');
  //   }

  //   await this.authService.resetPassword(token, password);
  //   return {
  //     message: 'Mật khẩu đã được đặt lại thành công.',
  //   };
  // }
}
