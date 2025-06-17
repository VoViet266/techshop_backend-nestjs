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
