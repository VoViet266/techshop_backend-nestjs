import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'Cửa hàng ABC', description: 'Tên cửa hàng' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ cửa hàng',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: '+84901234567',
    description: 'Số điện thoại liên hệ',
  })
  @IsPhoneNumber(null, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @ApiProperty({ example: 'store@example.com', description: 'Email liên hệ' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của cửa hàng',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
