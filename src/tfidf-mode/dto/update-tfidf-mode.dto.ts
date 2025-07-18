import { PartialType } from '@nestjs/swagger';
import { CreateTfidfModeDto } from './create-tfidf-mode.dto';

export class UpdateTfidfModeDto extends PartialType(CreateTfidfModeDto) {}
