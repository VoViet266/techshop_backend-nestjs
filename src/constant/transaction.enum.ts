export enum TransactionType {
  IMPORT = 'import', // Nhập hàng vào kho (từ nhà cung cấp hoặc nguồn bên ngoài)
  EXPORT = 'export', // Xuất hàng ra khỏi kho (bán hàng, huỷ hàng, v.v.)
  TRANSFER = 'transfer', // Chuyển kho
  TRANSFER_IN = 'transfer-in', // Nhập tay (tự điều chiển trong hệ thống)
  TRANSFER_OUT = 'transfer-out', // Xuat tay (tự điều chiển trong hệ thống)
  ADJUST = 'adjust', // Tự điều chiển trong hệ thống
}
export enum TransactionStatus {
  PENDING = 'pending', // Đang chờ xử lý
  IN_TRANSIT = 'in-transit', // Đang được vận chuyển
  RECEIVED = 'received', // Đã nhận hàng
}

export enum TransactionSource {
  ORDER = 'order', // Phát sinh từ đơn hàng
  RETURN = 'return', // Phát sinh từ đơn trả hàng
  MANUAL = 'manual', // Nhập tay (tự điều chỉnh trong hệ thống)
  TRANSFER = 'transfer', // Phát sinh từ chuyển kho
}
