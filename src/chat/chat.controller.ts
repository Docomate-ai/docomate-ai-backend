import { Body, Controller, Param, Post, Req, Session } from '@nestjs/common';
import { Request } from 'express';
import { MessageDto } from './dtos/message.dto';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  @Post(':projectId')
  async talkWithCodeBase(
    @Param('projectId') projectId: string,
    @Body() body: MessageDto,
    @Req() req: Request,
  ) {
    const token = req.cookies?.token;
    const { sub } = this.jwtService.verify(token);
    return this.chatService.generateChat(body.query, projectId, sub);
  }
}
