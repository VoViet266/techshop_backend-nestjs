import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchemas } from './schemas/banner.schema';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchemas }]),
  ],
})
export class BannerModule {}
