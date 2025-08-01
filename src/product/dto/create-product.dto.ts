import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsMongoId,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';









export class VariantColorDto {
 
  @IsString()
  name: string;


  @IsString()
  hex: string;
}

export class VariantMemoryDto {
  
  @IsString()
  ram: string;

 
  @IsString()
  storage: string;
}

export class VariantDto {

  name?: string;


  price?: number;

  
  color?: VariantColorDto;

 
  memory?: VariantMemoryDto;

 
  images: string[];

  weight?: number;
  


  isActive?: boolean;
}

export class CreateProductDto {
  name: string;
  description?: string;
  galleryImages: string;
  slug: string;
  promotions?: string[];
  warranties?: string[];
  category: string;
  brand: string;
  variants?: VariantDto[];
  discount: number;
  attributes?: Record<string, any>;
  tags?: string[];

  viewCount?: number;

  averageRating?: number;

  reviewCount?: number;

  isActive?: boolean;

  isFeatured?: boolean;
}
