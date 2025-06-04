import {
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsObject,
  IsMongoId,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { isValidObjectId, ObjectId } from 'mongoose';

// Giả sử bạn có CartItemDto đã định nghĩa rồi
export class CartItemDto {
  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3d',
    description: 'ID sản phẩm',
  })
  @IsMongoId()
  product: string;

  @ApiProperty({ example: 2, description: 'Số lượng sản phẩm' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 1500,
    description: 'Giá của sản phẩm tại thời điểm đặt hàng',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3e',
    description: 'ID biến thể sản phẩm',
  })
  @IsMongoId()
  variant: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'userId123' })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ type: [CartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({ example: 1500 })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ example: 'pending', description: 'Trạng thái đơn hàng' })
  @IsString()
  status: string;

  @ApiProperty({ example: '123 Đường ABC, Quận 1, TP.HCM' })
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    example: 'credit_card',
    description: 'Phương thức thanh toán',
  })
  @IsString()
  paymentMethod: string;
}
