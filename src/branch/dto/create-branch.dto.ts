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
  name: string;

  address: string;

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
