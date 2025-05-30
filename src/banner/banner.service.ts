import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: SoftDeleteModel<BannerDocument>,
  ) {}
  create(createBannerDto: CreateBannerDto) {
    return this.bannerModel.create(createBannerDto);
  }

  findAll() {
    return `This action returns all banner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
