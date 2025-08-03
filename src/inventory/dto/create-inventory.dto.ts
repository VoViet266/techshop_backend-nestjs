import { Min } from 'class-validator';


export class VariantDto {
 
  variantId: string;


  @Min(0)
  stock: number;


  @Min(0)
  cost: number;
}

export class CreateInventoryDto {

  branch: string;


  product: string;

  
  variants: VariantDto[];
}
export class CreateStockMovementDto {
  branchId: string; // id chi nhánh
  productId: string; // id sản phẩm
  variants: {
    variantId: string; // id biến thể sản phẩm
    variantColor: string;
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
    variantColor: string;
    quantity: number; // số lượng chuyển
    unit?: string;
  }[]; // danh sách sản phẩm và số lượng tương ứng
  approvedBy?: string;
  approvedAt?: Date;
  rejectNote?: string;
  status: string;
  note?: string; // ghi chú chuyển kho (tùy chọn)
}
