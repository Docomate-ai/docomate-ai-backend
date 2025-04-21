import { Body, Controller, Param, Post } from '@nestjs/common';
import { MessageDto } from './dtos/message.dto';

@Controller('chat')
export class ChatController {
  @Post(':projectId')
  async talkWithCodeBase(
    @Param('projectId') projectId: string,
    @Body() body: MessageDto,
  ) {}
}
