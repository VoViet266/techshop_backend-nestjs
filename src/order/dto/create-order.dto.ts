import { CartItemDto } from 'src/cart/dto/create-cart.dto';
import { Variant } from 'src/product/schemas/product.schema';

export class CreateOrderDto {
  user: string;
  items: CartItemDto[];
  totalPrice: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
}
