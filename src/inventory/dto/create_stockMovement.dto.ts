import {
  TransactionSource,
  TransactionType,
} from 'src/constant/transaction.enum';
import { VariantDto } from './create-inventory.dto';
import { Types } from 'mongoose';

export class CreateStockMovementDto {
  branchId: string; // id chi nhánh
  productId: string; // id sản phẩm
  variants: {
    variantId: Types.ObjectId;
    stock: number; // số lượng tồn kho của biến thể
    cost?: number; // giá vốn của biến thể (tùy chọn)
  }[]; // danh sách biến thể và số lượng tương ứng
  type: TransactionType;
  note?: string;
  relatedTo?: TransactionSource;
  relatedId?: string;
}
