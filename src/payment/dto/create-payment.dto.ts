export class CreatePaymentDto {
  order: string;
  user: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
}
