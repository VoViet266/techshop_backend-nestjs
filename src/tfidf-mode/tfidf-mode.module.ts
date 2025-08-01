import { Module } from '@nestjs/common';
import { TfidfModeService } from './tfidf-mode.service';
import { TfidfModeController } from './tfidf-mode.controller';

@Module({
  controllers: [TfidfModeController],
  providers: [TfidfModeService],
})
export class TfidfModeModule {}
