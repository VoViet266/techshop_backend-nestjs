import { Module } from '@nestjs/common';
import { CloundinaryService } from './cloundinary.service';
import { CloundinaryController } from './cloundinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CloundinaryController],
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloundinaryService],
  exports: [CloudinaryProvider, CloundinaryService],
})
export class CloundinaryModule {}
