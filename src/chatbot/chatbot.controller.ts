// src/chat/chat.controller.ts
import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { ChatBotService } from './chatbot.service';
import { User } from 'src/decorator/userDecorator';
import { IUser } from 'src/user/interface/user.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('chat')
export class ChatBotController {
  constructor(private readonly chatService: ChatBotService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Body('message') message: string,
    @Headers('authorization') authHeader: string,
    @User() user: IUser,
  ) {
    const userToken = authHeader.split(' ')[1]; // Lấy token từ header Authorization
    const response = await this.chatService.askRasa(
      message,
      user._id,
      userToken,
    );
    const reply = await this.chatService.getGeminiResponse(message, response);
    return { reply };
  }
}
