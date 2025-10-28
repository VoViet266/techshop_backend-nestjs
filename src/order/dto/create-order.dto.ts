import {
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsObject,
  IsMongoId,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  product?: string;

  quantity?: number;

  branch?: string;

  price?: number;

  variant?: string;
}
class RecipientDto {
  @IsString()
  name: string;

  phone: string;

  address: string;

  note?: string;
}
export class CreateOrderDto {
  user?: string;

  recipient: RecipientDto;

  buyer?: RecipientDto;

  items?: CartItemDto[];

  totalPrice?: number;

  branch?: string[];

  status?: string;

  source?: string;

  paymentStatus: string;

  payment: string;

  isReturn: boolean;

  returnStatus?: string;

  returnProcessedBy?: any;

  returnReason?: string;

  paymentMethod: string;

  phone: string;
}
