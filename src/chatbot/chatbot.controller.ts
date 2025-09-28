// src/chat/chat.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatBotService } from './chatbot.service';
import { User } from 'src/decorator/userDecorator';
import { IUser } from 'src/user/interface/user.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('chat')
export class ChatBotController {
  constructor(private readonly chatService: ChatBotService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Body('message') message: string, @User() user: IUser) {
    const response = await this.chatService.askRasa(message, user._id);
    const reply = await this.chatService.sendMessage(message, response);
    return { reply };
  }
}
