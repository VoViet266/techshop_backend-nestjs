import {
  IsString,
  IsOptional,
  IsUrl,
  IsEmail,
  IsNumber,
  Min,
  Max,
  IsObject,
} from 'class-validator';

export class CreateBrandDto {
 
  name: string;

 
  description?: string;

  
  logo?: string;

  
}
