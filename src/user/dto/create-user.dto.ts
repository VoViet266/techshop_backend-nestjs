import { IsEmail, IsEnum, isEnum, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export class RegisterUserDto {
  @IsNotEmpty({
    message: 'Name không được để trống',
  })
  name: string;

  @IsNotEmpty({
    message: 'Password không được để trống',
  })
  password: string;

  avatar: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  email: string;
  address: string;
  rolesID: string[];
//   @IsEnum(Gender, {
//     message: 'Giới tính không hợp lệ',
//   })
  gender: string;
  age: string;
}
