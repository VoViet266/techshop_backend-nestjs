import {
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from 'src/constant/payment.enum';

export class CreatePaymentDto {
  order: string;
  user: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  transactionCode?: string;
  transactionDate?: Date;
  refundStatus?: RefundStatus;
}
