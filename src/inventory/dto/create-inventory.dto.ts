import { Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VariantDto {
 
  variantId: string;

  @ApiProperty({ example: 100, description: 'Số lượng tồn kho của biến thể' })
  @Min(0)
  stock: number;

  @ApiProperty({ example: 50000, description: 'Giá vốn của biến thể' })
  @Min(0)
  cost: number;
}

export class CreateInventoryDto {
  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3e',
    description: 'ID cửa hàng',
  })
  branch: string;

  @ApiProperty({
    example: '64a2b3c4d5e6f7890a1b2c3f',
    description: 'ID sản phẩm',
  })
  product: string;

  
  variants: VariantDto[];
}
export class CreateStockMovementDto {
  branchId: string; // id chi nhánh
  productId: string; // id sản phẩm
  variants: {
    variantId: string; // id biến thể sản phẩm
    quantity: number; // số lượng tương ứng
    cost?: number; // giá vốn của biến thể (tùy chọn)
  }[]; // danh sách biến thể và số lượng tương ứng

  note?: string; // ghi chú chuyển kho (tùy chọn)
  source?: string;
}

export class CreateTransferDto {
  fromBranchId: string; // chi nhánh gửi
  toBranchId: string; // chi nhánh nhận
  items: {
    productId: string; // id sản phẩm
    variantId: string; // id biến thể sản phẩm
    quantity: number; // số lượng chuyển
    unit?: string;
  }[]; // danh sách sản phẩm và số lượng tương ứng
  approvedBy?: string;
  approvedAt?: Date;
  rejectNote?: string;
  status: string;
  note?: string; // ghi chú chuyển kho (tùy chọn)
}
