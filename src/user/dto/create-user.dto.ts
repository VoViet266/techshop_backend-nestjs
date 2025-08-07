import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  @IsString()
  name: string;

  branch?: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  password: string;

  phone?: string;

  address?: string[];

  age?: number;

  refreshToken: string;

  avatar?: string;

  role?: string;

  status?: string;
}

class AddressDto {
  specificAddress: string;

  addressDetail: string;

  default: boolean;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  avatar?: string;

  email: string;

  addresses?: AddressDto[];

  phone?: string;

  age?: number;

  role?: string[];

  gender?: string;
}
export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString()
  password: string;
}
