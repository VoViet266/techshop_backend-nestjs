export class CreatePaymentDto {
  order: string;
  amount: number;
  description: string;
  payType: string;
}
