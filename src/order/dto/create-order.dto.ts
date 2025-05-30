import { CartItemDto } from 'src/cart/dto/create-cart.dto';

export class CreateOrderDto {
  user: string;
  items: CartItemDto[];
  totalPrice: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
}
