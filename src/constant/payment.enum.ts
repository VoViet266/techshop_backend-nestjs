export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'PENDING', // Đang chờ thanh toán
  COMPLETED = 'COMPLETED', // Đã thanh toán
  FAILED = 'FAILED', // Thanh toán thất bại
  CANCELLED = 'CANCELLED', // Đã hủy
  REFUNDED = 'REFUNDED', // Đã hoàn tiền
}

export enum RefundStatus {
  NONE = 'none',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
export enum OrderSource {
  ONLINE = 'online',
  POS = 'pos',
}
