import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber({}, { message: 'Kinh độ (longitude) phải là số' })
  @IsNotEmpty()
  longitude: number;

  @IsNumber({}, { message: 'Vĩ độ (latitude) phải là số' })
  @IsNotEmpty()
  latitude: number;
}

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên chi nhánh không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @IsObject()
  @IsNotEmpty({ message: 'Vị trí (location) không được để trống' })
  @ValidateNested({ message: 'Định dạng vị trí không hợp lệ' })
  @Type(() => LocationDto)
  location: LocationDto;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
