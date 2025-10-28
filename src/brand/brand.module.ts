import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [
    CaslModule,
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
})
export class BrandModule {}
