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
  colorName: string;

  @IsString()
  colorHex: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class VariantDto {
  @IsString()
  name: string;

  price: number;

  memory: {
    ram: string;
    storage: string;
  };

  @IsArray()
  color: VariantColorDto[];
}

export class CreateProductDto {
  @IsString()
  name: string;
  description?: string;
  galleryImages?: string[];

  slug: string;

  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // promotions?: string[];

  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // warranties?: string[];

  category: string;

  brand: string;

  variants?: VariantDto[];

  discount: number;

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
