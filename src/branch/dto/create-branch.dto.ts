import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Cửa hàng ABC', description: 'Tên cửa hàng' })
  name: string;

  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ cửa hàng',
  })
  address: string;

  @ApiProperty({
    example: '+84901234567',
    description: 'Số điện thoại liên hệ',
  })
  phone: string;
  location: string;

  @ApiProperty({ example: 'branch@example.com', description: 'Email liên hệ' })
  email: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của cửa hàng',
  })
  isActive?: boolean;
}
