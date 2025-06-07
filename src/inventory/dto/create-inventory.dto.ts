import {
  IsString,
  IsNumber,
  IsMongoId,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class VariantDto {
  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3d',
    description: 'ID biến thể sản phẩm',
  })
  @IsMongoId()
  variantId: string;

  @ApiProperty({ example: 100, description: 'Số lượng tồn kho của biến thể' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 50000, description: 'Giá vốn của biến thể' })
  @IsNumber()
  @Min(0)
  cost: number;
}

export class CreateInventoryDto {
  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3e',
    description: 'ID cửa hàng',
  })
  @IsMongoId()
  branch: string;

  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3f',
    description: 'ID sản phẩm',
  })
  @IsMongoId()
  product: string;

  @ApiProperty({
    type: [VariantDto],
    description: 'Danh sách biến thể sản phẩm',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
export class CreateStockMovementDto {
  branchId: string; // id chi nhánh
  productId: string; // id sản phẩm
  variants: {
    variantId: string; // id biến thể sản phẩm
    stock: number; // số lượng tồn kho của biến thể
    cost?: number; // giá vốn của biến thể (tùy chọn)
  }[]; // danh sách biến thể và số lượng tương ứng
}

export class CreateTransferDto {
  fromBranchId: string; // chi nhánh gửi
  toBranchId: string; // chi nhánh nhận
  items: {
    productId: string; // id sản phẩm
    variant: string; // id biến thể sản phẩm
    quantity: number; // số lượng chuyển
  }[]; // danh sách sản phẩm và số lượng tương ứng
  status: string;
  note?: string; // ghi chú chuyển kho (tùy chọn)
}
