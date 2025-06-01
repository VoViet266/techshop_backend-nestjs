import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDate,
} from 'class-validator';

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Age phải là số' })
  age: number;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsArray()
  role: object[];

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  address: {
    addressDetail: string;
    default: boolean;
  }[];

  @IsOptional()
  @IsNumber({}, { message: 'Age phải là số' })
  age: number;

  role: string[];

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  phone: string;
}
