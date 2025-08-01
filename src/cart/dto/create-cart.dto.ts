import { Types } from 'mongoose';
import {

  Min,

} from 'class-validator';

import { Type } from 'class-transformer';

export class CartItemDto {
 
  product: string;

  
  variant: Types.ObjectId | string;


  @Min(1)
  quantity: number;

  
  price?: number;

  branch: string;
}

export class CreateCartDto {
 
  user: Types.ObjectId | string;

  
  items: CartItemDto[];

 
  totalQuantity?: number;

 
  totalPrice?: number;
}
