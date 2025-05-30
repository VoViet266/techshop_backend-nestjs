import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: SoftDeleteModel<PromotionDocument>,
  ) {}
  create(createPromotionDto: CreatePromotionDto) {
    return this.promotionModel.create(createPromotionDto);
  }

  findAll() {
    return `This action returns all promotion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promotion`;
  }

  update(id: number, updatePromotionDto: UpdatePromotionDto) {
    return `This action updates a #${id} promotion`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotion`;
  }
}
