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
    return this.bannerModel.find().sort({ createdAt: -1 }).exec();
  }

  findOne(id: number) {
    return this.bannerModel.findById(id).exec();
  }

  update(id: string, updateBannerDto: UpdateBannerDto) {
    return this.bannerModel
      .updateOne({ _id: id }, { $set: updateBannerDto })
      .exec();
  }

  remove(id: string) {
    return this.bannerModel.deleteOne({ _id: id });
  }
} 
