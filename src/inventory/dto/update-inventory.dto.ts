import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto, CreateTransferDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}

export class UpdateTransferDto extends PartialType(CreateTransferDto) {}
