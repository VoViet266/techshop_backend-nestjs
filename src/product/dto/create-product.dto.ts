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
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSpecsDto {
  @ApiPropertyOptional({
    example: '6.5 inch',
    description: 'Kích thước màn hình',
  })
  @IsString()
  @IsOptional()
  displaySize?: string;

  @ApiPropertyOptional({ example: 'OLED', description: 'Loại màn hình' })
  @IsString()
  @IsOptional()
  displayType?: string;

  @ApiPropertyOptional({ example: 'Snapdragon 888', description: 'Bộ xử lý' })
  @IsString()
  @IsOptional()
  processor?: string;

  @ApiPropertyOptional({ example: 'Android 11', description: 'Hệ điều hành' })
  @IsString()
  @IsOptional()
  operatingSystem?: string;

  @ApiPropertyOptional({ example: '4000mAh', description: 'Dung lượng pin' })
  @IsString()
  @IsOptional()
  battery?: string;

  @ApiPropertyOptional({ example: '180g', description: 'Trọng lượng' })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiPropertyOptional({
    example: '160 x 75 x 8 mm',
    description: 'Kích thước thiết bị',
  })
  @IsString()
  @IsOptional()
  dimensions?: string;
}

export class ConnectivityDto {
  @ApiPropertyOptional({
    example: '802.11 a/b/g/n/ac',
    description: 'Chuẩn WiFi',
  })
  @IsString()
  @IsOptional()
  wifi?: string;

  @ApiPropertyOptional({ example: '5.0', description: 'Phiên bản Bluetooth' })
  @IsString()
  @IsOptional()
  bluetooth?: string;

  @ApiPropertyOptional({ example: '4G LTE', description: 'Kết nối di động' })
  @IsString()
  @IsOptional()
  cellular?: string;

  @ApiPropertyOptional({ example: true, description: 'Hỗ trợ NFC hay không' })
  @IsBoolean()
  @IsOptional()
  nfc?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Hỗ trợ GPS hay không' })
  @IsBoolean()
  @IsOptional()
  gps?: boolean;

  @ApiPropertyOptional({
    example: ['USB-C', '3.5mm jack'],
    description: 'Cổng kết nối',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ports?: string[];
}

export class CameraFrontDto {
  @ApiProperty({ example: '12MP', description: 'Độ phân giải camera trước' })
  @IsString()
  resolution: string;

  @ApiProperty({
    example: ['HDR', 'Panorama'],
    description: 'Tính năng camera trước',
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];
}

export class CameraRearDto {
  @ApiProperty({ example: '48MP', description: 'Độ phân giải camera sau' })
  @IsString()
  resolution: string;

  @ApiProperty({
    example: ['OIS', 'Night mode'],
    description: 'Tính năng camera sau',
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ example: 3, description: 'Số lượng ống kính' })
  @IsNumber()
  lensCount: number;
  

  @ApiPropertyOptional({
    example: ['4K', 'Slow motion'],
    description: 'Tính năng quay video',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videoRecording?: string[];
}

export class CameraDto {
  @ApiProperty({ type: CameraFrontDto, description: 'Thông số camera trước' })
  @ValidateNested()
  @Type(() => CameraFrontDto)
  front: CameraFrontDto;

  @ApiProperty({ type: CameraRearDto, description: 'Thông số camera sau' })
  @ValidateNested()
  @Type(() => CameraRearDto)
  rear: CameraRearDto;

  videoRecording?: string[];
}

export class VariantColorDto {
  @ApiProperty({ example: 'Red', description: 'Tên màu sắc' })
  @IsString()
  name: string;

  @ApiProperty({ example: '#FF0000', description: 'Mã màu hex' })
  @IsString()
  hex: string;
}

export class VariantMemoryDto {
  @ApiProperty({ example: '8GB', description: 'Dung lượng RAM' })
  @IsString()
  ram: string;

  @ApiProperty({ example: '128GB', description: 'Dung lượng lưu trữ' })
  @IsString()
  storage: string;
}

export class VariantDto {
  @ApiProperty({ example: 'Standard', description: 'Tên biến thể' })
  @IsString()
  name: string;

  @ApiProperty({ example: 999, description: 'Giá bán' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ type: VariantColorDto, description: 'Thông tin màu sắc' })
  @ValidateNested()
  @Type(() => VariantColorDto)
  color: VariantColorDto;

  @ApiProperty({ type: VariantMemoryDto, description: 'Thông tin bộ nhớ' })
  @ValidateNested()
  @Type(() => VariantMemoryDto)
  memory: VariantMemoryDto;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Danh sách hình ảnh',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];

  @ApiPropertyOptional({ example: 200, description: 'Trọng lượng (gram)' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ example: true, description: 'Trạng thái kích hoạt' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 14', description: 'Tên sản phẩm' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Smartphone mới nhất từ Apple',
    description: 'Mô tả sản phẩm',
  })
  @IsString()
  @IsOptional()
  description?: string;

  slug: string;

  @IsMongoId()
  category: string;

  @ApiProperty({
    example: '60d5f9c2e1a5a3a3f0d6e0f2',
    description: 'ID thương hiệu',
    type: String,
  })
  @IsMongoId()
  brand: string;

  @ApiProperty({
    type: [VariantDto],
    description: 'Danh sách biến thể sản phẩm',
  })
  variants?: VariantDto[];

  @ApiProperty({ example: 10, description: 'Giảm giá (%)' })
  @IsNumber()
  discount: number;

  @ApiPropertyOptional({
    type: ProductSpecsDto,
    description: 'Thông số kỹ thuật',
  })
  @ValidateNested()
  @Type(() => ProductSpecsDto)
  @IsOptional()
  specifications?: ProductSpecsDto;

  @ApiPropertyOptional({ type: ConnectivityDto, description: 'Kết nối' })
  @ValidateNested()
  @Type(() => ConnectivityDto)
  @IsOptional()
  connectivity?: ConnectivityDto;

  @ApiPropertyOptional({ type: CameraDto, description: 'Thông tin camera' })
  @ValidateNested()
  @Type(() => CameraDto)
  @IsOptional()
  camera?: CameraDto;

  @ApiPropertyOptional({
    example: ['smartphone', 'apple'],
    description: 'Tags sản phẩm',
  })
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
