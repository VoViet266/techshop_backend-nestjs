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
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  note?: string;
}
export class CreateOrderDto {
  
  user?: string;

  @ValidateNested()
  @Type(() => RecipientDto)
  @IsObject()
  @IsOptional()
  recipient: RecipientDto;

  
  @ValidateNested()
  @Type(() => RecipientDto)
  @IsObject()
  @IsOptional()
  buyer?: RecipientDto;

 
 
  items?: CartItemDto[];

  totalPrice?: number;

 
  branch: string[];

  
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
