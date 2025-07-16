import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchemas } from './schemas/banner.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
  imports: [ CaslModule ,
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchemas }]),
  ],
})
export class BannerModule {}
