import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsMongoId,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Tên vai trò' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Vai trò quản trị hệ thống',
    description: 'Mô tả vai trò',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['64a2b3c4d5e6f7890a1b2c3d', '64a2b3c4d5e6f7890a1b2c3e'],
    description: 'Danh sách permission IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  permissions?: string[];

  @ApiPropertyOptional({ description: 'Ngày tạo' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Ngày cập nhật' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}
