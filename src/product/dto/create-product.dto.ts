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

export class ProductSpecsDto {
 
  @IsString()
  @IsOptional()
  displaySize?: string;


  @IsString()
  @IsOptional()
  displayType?: string;

  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  operatingSystem?: string;

  @IsString()
  @IsOptional()
  battery?: string;

  @IsString()
  @IsOptional()
  weight?: string;
}

export class ConnectivityDto {
  
  @IsString()
  @IsOptional()
  wifi?: string;

  @IsString()
  @IsOptional()
  bluetooth?: string;

  @IsString()
  @IsOptional()
  cellular?: string;

  @IsBoolean()
  @IsOptional()
  nfc?: boolean;

  @IsBoolean()
  @IsOptional()
  gps?: boolean;

 
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ports?: string[];
}

export class CameraFrontDto {
  @IsString()
  resolution: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];
}

export class CameraRearDto {
  @IsString()
  resolution: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsNumber()
  lensCount: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videoRecording?: string[];
}

export class CameraDto {
  @ValidateNested()
  @Type(() => CameraFrontDto)
  front: CameraFrontDto;

  @ValidateNested()
  @Type(() => CameraRearDto)
  rear: CameraRearDto;
}

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
