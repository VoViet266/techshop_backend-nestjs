export enum OrderStatus {
  PENDING = 'PENDING', // Đơn hàng vừa tạo, chưa thanh toán
  PROCESSING = 'PROCESSING', // Đang xử lý thanh toán
  SUCCESS = 'SUCCESS', // Thanh toán thành công
  FAILED = 'FAILED', // Thanh toán thất bại
  CANCELLED = 'CANCELLED', // Người dùng hoặc hệ thống hủy đơn
  REFUNDED = 'REFUNDED', // Đã hoàn tiền
}
