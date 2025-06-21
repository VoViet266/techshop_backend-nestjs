import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ResponseMessage } from 'src/decorator/messageDecorator';
import { IUser } from 'src/user/interface/user.interface';
import { User } from 'src/decorator/userDecorator';
import { Public } from 'src/decorator/publicDecorator';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { LoginDto, RegisterUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Đăng nhập thành công')
  @Public()
  @Post('/login')
  @ApiBody({ type: LoginDto })
  handleLogin(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Đăng ký thành công')
  async register(@Body() register: RegisterUserDto) {
    console.log(register);
    return this.userService.register(register);
  }
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Tự động redirect đến Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any) {
    return {
      message: 'Đăng nhập thành công!',
      user: req.user,
    };
  }

  @ResponseMessage('Lấy thông tin tài khoản thành công')
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return {
      user,
    };
  }

  @ResponseMessage('Lấy Refresh Token thành công')
  @Get('/refresh')
  @Public()
  handleRefreshToken(
    @Req() request: Request & { cookies: { [key: string]: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = request.cookies['refresh_Token'];
    return this.authService.refreshToken(refreshToken, res);
  }
  @ResponseMessage('Đăng xuất thành công')
  @Get('/logout')
  handleLogout(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
    return this.authService.logout(res, user);
  }

  @Post('forgot-password')
  @ResponseMessage('Yêu cầu đặt lại mật khẩu')
  @Public()
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email là trường bắt buộc.');
    }

    await this.authService.forgotPassword(email);
    return `Yêu cầu đặt lại mật khẩu đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư đến của bạn.`;
  }

  @Post('reset-password')
  @ResponseMessage('Mật khẩu đã được đặt lại thành công.')
  @Public()
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    if (!token || !password) {
      throw new BadRequestException(
        'Token và mật khẩu mới là các trường bắt buộc.',
      );
    }

    if (password.length < 8) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 8 ký tự.');
    }

    await this.authService.resetPassword(token, password);
    return {
      message: 'Mật khẩu đã được đặt lại thành công.',
    };
  }
}
