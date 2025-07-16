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
  name: string;

  description?: string;

  permissions?: string[];

  createdAt?: Date;

  updatedAt?: Date;
}
