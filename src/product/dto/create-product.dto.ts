import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsObject,
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

  @IsString()
  @IsOptional()
  dimensions?: string;
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
}

export class CameraDto {
  @ValidateNested()
  @Type(() => CameraFrontDto)
  front: CameraFrontDto;

  @ValidateNested()
  @Type(() => CameraRearDto)
  rear: CameraRearDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videoRecording?: string[];
}

export class VariantColorDto {
  @IsString()
  name: string;

  @IsString()
  hex: string;
}

export class VariantMemoryDto {
  ram: string;
  storage: string;
}

export class VariantDto {

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  // @IsNumber()
  // @Min(0)
  // compareAtPrice: number;

  @ValidateNested()
  @Type(() => VariantColorDto)
  color: VariantColorDto;

  @ValidateNested()
  @Type(() => VariantMemoryDto)
  memory: VariantMemoryDto;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  createdAt?: Date;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsMongoId()
  category: string;

  @IsMongoId()
  brand: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @ArrayMinSize(1)
  variants: VariantDto[];

  @ValidateNested()
  @Type(() => ProductSpecsDto)
  @IsOptional()
  specifications?: ProductSpecsDto;

  @ValidateNested()
  @Type(() => ConnectivityDto)
  @IsOptional()
  connectivity?: ConnectivityDto;

  @ValidateNested()
  @Type(() => CameraDto)
  @IsOptional()
  camera?: CameraDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  viewCount?: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  averageRating?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reviewCount?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
