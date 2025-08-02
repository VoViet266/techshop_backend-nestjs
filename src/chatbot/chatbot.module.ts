import { Module } from '@nestjs/common';
import { ChatBotService } from './chatbot.service';
import { ChatBotController } from './chatbot.controller';
import { ProductModule } from 'src/product/product.module';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/product/schemas/product.schema';

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
