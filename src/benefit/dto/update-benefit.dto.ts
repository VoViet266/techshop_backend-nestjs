import { PartialType } from '@nestjs/swagger';
import { CreateBenefitDto } from './create-benefit.dto';

export class UpdateBenefitDto extends PartialType(CreateBenefitDto) {}
