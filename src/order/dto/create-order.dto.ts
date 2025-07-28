import {
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsObject,
  IsMongoId,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { isValidObjectId, ObjectId } from 'mongoose';

export class CartItemDto {
  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3d',
    description: 'ID sản phẩm',
  })
  product?: string;

  @ApiProperty({ example: 2, description: 'Số lượng sản phẩm' })
  quantity?: number;

  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3d',
    description: 'ID chi nhánh nơi đặt hàng',
  })
  branch?: string;

  @ApiProperty({
    example: 1500,
    description: 'Giá của sản phẩm tại thời điểm đặt hàng',
  })
  price?: number;

  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3e',
    description: 'ID biến thể sản phẩm',
  })
  variant?: string;
}
class RecipientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  note?: string;
}
export class CreateOrderDto {
  @ApiProperty({ example: 'userId123' })
  user?: string;

  @ValidateNested()
  @Type(() => RecipientDto)
  @IsObject()
  @IsOptional()
  recipient: RecipientDto;

  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3f',
    description: 'ID người dùng',
  })
  @ValidateNested()
  @Type(() => RecipientDto)
  @IsObject()
  @IsOptional()
  buyer?: RecipientDto;

  @ApiProperty({ type: [CartItemDto] })
  items?: CartItemDto[];

  @ApiProperty({ example: 1500 })
  totalPrice?: number;

  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3f',
    description: 'ID chi nhánh nơi đặt hàng',
  })
  branch: string[];

  @ApiProperty({ example: 'pending', description: 'Trạng thái đơn hàng' })
  status?: string;

  source?: string;

  paymentStatus: string;

  payment: string;


  @ApiProperty({
    example: 'credit_card',
    description: 'Phương thức thanh toán',
  })
  paymentMethod: string;

  phone: string;
}
