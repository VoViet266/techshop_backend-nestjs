export enum OrderStatus {
  PENDING = 'PENDING', // Đơn hàng vừa tạo, chưa xử lý
  PROCESSING = 'PROCESSING', // Đang xử lý
  CONFIRMED = 'CONFIRMED', // Đã xác nhận
  SHIPPING = 'SHIPPING', // Đang giao hàng
  DELIVERED = 'DELIVERED', // Đã giao hàng
  CANCELLED = 'CANCELLED', // Đã hủy
  RETURNED = 'RETURNED', // Đã trả hàng
}
