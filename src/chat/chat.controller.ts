import { Body, Controller, Param, Post } from '@nestjs/common';
import { MessageDto } from './dtos/message.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post(':projectId')
  async talkWithCodeBase(
    @Param('projectId') projectId: string,
    @Body() body: MessageDto,
  ) {
    return this.chatService.generateChat(body.query, projectId);
  }
}
