import { Module } from '@nestjs/common';
import { CloundinaryService } from './cloundinary.service';
import { CloundinaryController } from './cloundinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [CloundinaryController],
  imports: [ConfigModule, CaslModule],
  providers: [CloudinaryProvider, CloundinaryService],
  exports: [CloudinaryProvider, CloundinaryService],
})
export class CloundinaryModule {}
