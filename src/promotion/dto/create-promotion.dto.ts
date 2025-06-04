import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Giảm giá mùa hè', description: 'Tiêu đề chương trình khuyến mãi' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Giảm giá 10% cho tất cả sản phẩm mùa hè', description: 'Mô tả chương trình' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'percentage', description: 'Loại giảm giá (ví dụ: "percentage", "fixed")' })
  @IsString()
  discountType: string;

  @ApiProperty({ example: 10, description: 'Giá trị giảm giá (theo loại giảm giá)' })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({ example: 100000, description: 'Giá trị giảm tối đa' })
  @IsNumber()
  @Min(0)
  maxDiscountValue: number;

  @ApiProperty({ example: '2025-06-04T00:00:00Z', description: 'Ngày bắt đầu áp dụng khuyến mãi' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: false, description: 'Chỉ áp dụng cho người dùng mới' })
  @IsBoolean()
  isForNewUsersOnly: boolean;

  @ApiProperty({ example: true, description: 'Trạng thái hoạt động của khuyến mãi' })
  @IsBoolean()
  isActive: boolean;
}
