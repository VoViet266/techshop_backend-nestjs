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
  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '0912345678' })
  phone?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['123 Đường ABC', '456 Đường XYZ'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  address?: string[];

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber({}, { message: 'Age phải là số' })
  age?: number;
  refreshToken: string;
  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: 'admin' })
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}

class AddressDto {
  @ApiProperty({ example: '123 Đường ABC, Quận 1' })
  @IsString()
  addressDetail: string;

  @ApiProperty({ example: true })
  default: boolean;
}

export class RegisterUserDto {
  @ApiProperty({ example: 'Nguyen Van B' })
  @IsNotEmpty({ message: 'Name không được để trống' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'user2@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    type: [AddressDto],
    example: [
      { addressDetail: '123 Đường ABC', default: true },
      { addressDetail: '456 Đường XYZ', default: false },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto[];

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber({}, { message: 'Age phải là số' })
  age?: number;

  @ApiProperty({ type: [String], example: ['user', 'admin'] })
  @IsArray()
  @IsString({ each: true })
  role: string[];

  @ApiPropertyOptional({ example: 'male' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;
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
