import { Types } from 'mongoose';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CartItemDto {
  @IsMongoId()
  product: string;

  @IsString()
  variant: Types.ObjectId | string;

  @IsNumber()
  @Min(1)
  quantity: number;

  price: number;
}

export class CreateCartDto {
  user: Types.ObjectId | string;

  items: CartItemDto[];

  totalQuantity?: number;

  totalPrice?: number;
}
