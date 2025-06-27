import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword456' })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({ example: 'newPassword456' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsNotEmpty({ message: 'Name không được để trống' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiPropertyOptional({ example: '0912345678' })
  phone?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['123 Đường ABC', '456 Đường XYZ'],
  })
  address?: string[];

  @ApiPropertyOptional({ example: 25 })
  age?: number;

  refreshToken: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string;

  @ApiPropertyOptional({ example: 'admin' })
  role?: string;

  @ApiPropertyOptional({ example: 'active' })
  status?: string;
}

class AddressDto {
  specificAddress: string;
  @ApiProperty({ example: '123 Đường ABC, Quận 1' })
  addressDetail: string;

  @ApiProperty({ example: true })
  default: boolean;
}

export class RegisterUserDto {
  @ApiProperty({ example: 'Nguyen Van B' })
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string;

  @ApiProperty({ example: 'user2@example.com' })
  email: string;

  @ApiProperty({
    type: [AddressDto],
    example: [
      { addressDetail: '123 Đường ABC', default: true },
      { addressDetail: '456 Đường XYZ', default: false },
    ],
  })
  addresses: AddressDto[];

  phone?: string;

  @ApiPropertyOptional({ example: 30 })
  age?: number;

  @ApiProperty({ type: [String], example: ['user', 'admin'] })
  role: string[];

  @ApiPropertyOptional({ example: 'male' })
  gender?: string;
}
export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email đăng nhập' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu đăng nhập' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString()
  password: string;
}
