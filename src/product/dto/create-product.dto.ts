import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
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

  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // promotions?: string[];

  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // warranties?: string[];

  @IsString()
  category: string;

  @IsString()
  brand: string;

  @IsArray()
  variants?: VariantDto[];

  @IsNumber()
  discount: number;

  @IsOptional()
  attributes?: Record<string, any>;

  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // tags?: string[];

  @IsNumber()
  @IsOptional()
  viewCount?: number;

  @IsNumber()
  @IsOptional()
  averageRating?: number;

  @IsNumber()
  @IsOptional()
  reviewCount?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
