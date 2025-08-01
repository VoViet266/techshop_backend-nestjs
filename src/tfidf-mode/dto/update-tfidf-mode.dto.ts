
import { PartialType } from '@nestjs/mapped-types';
import { CreateTfidfModeDto } from './create-tfidf-mode.dto';

export class UpdateTfidfModeDto extends PartialType(CreateTfidfModeDto) {}
