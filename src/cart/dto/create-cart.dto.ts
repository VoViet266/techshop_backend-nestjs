import { Types } from 'mongoose';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CartItemDto {
  @ApiProperty({ example: '64a2b3c4d5e6f7890a1b2c3d', description: 'ID sản phẩm' })
  @IsMongoId()
  product: string;

  @ApiProperty({ example: '64a2b3c4d5e6f7890a1b2c3e', description: 'ID biến thể sản phẩm' })
  @IsString()
  variant: Types.ObjectId | string;

  @ApiProperty({ example: 2, description: 'Số lượng sản phẩm' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 50000, description: 'Giá sản phẩm tại thời điểm mua' })
  @IsNumber()
  price: number;
}

export class CreateCartDto {
  @ApiProperty({ example: '64a2b3c4d5e6f7890a1b2c3f', description: 'ID người dùng' })
  @IsMongoId()
  user: Types.ObjectId | string;

  @ApiProperty({ type: [CartItemDto], description: 'Danh sách các sản phẩm trong giỏ hàng' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiPropertyOptional({ example: 3, description: 'Tổng số lượng sản phẩm' })
  @IsNumber()
  @IsOptional()
  totalQuantity?: number;

  @ApiPropertyOptional({ example: 150000, description: 'Tổng giá trị giỏ hàng' })
  @IsNumber()
  @IsOptional()
  totalPrice?: number;
}
