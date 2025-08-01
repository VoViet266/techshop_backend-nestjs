import { Module } from '@nestjs/common';
import { ChatBotService } from './chatbot.service';
import { ChatBotController } from './chatbot.controller';
import { ProductModule } from 'src/product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ChatBotController],
  providers: [ChatBotService],
  // exports: [ChatBotService],
  imports: [
    ProductModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
  ],
})
export class ChatbotModule {}
