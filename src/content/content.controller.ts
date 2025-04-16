import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/authorized.guard';
import { GenerateReadmeDto } from './dtos/generate-readme.dto';
import { JwtService } from '@nestjs/jwt';
import { ContentService } from './content.service';

@Controller('content')
@UseGuards(AuthGuard)
export class ContentController {
  constructor(
    private jwtService: JwtService,
    private contentService: ContentService,
  ) {}

  @Get('readme-sections')
  getReadmeSections() {
    return this.contentService.getReadmeSections();
  }

  @Post(':projectId/generate-readme')
  async generateReadme(
    @Param('projectId') projectId: string,
    @Body() body: GenerateReadmeDto,
    @Session() session: any,
  ) {
    const { email: userMail, sub: userId } = this.jwtService.verify(
      session.token,
    );
    return this.contentService.generateReadme(
      projectId,
      userMail,
      body.sections,
    );
  }
}
