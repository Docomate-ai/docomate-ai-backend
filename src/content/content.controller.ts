import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/authorized.guard';
import { GenerateReadmeDto } from './dtos/generate-readme.dto';
import { JwtService } from '@nestjs/jwt';
import { ContentService } from './content.service';
import { SaveContentDto } from './dtos/save-content.dto';
import { Response, Request } from 'express';

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

  @Post(':projectId/contents')
  async getAllContents(
    @Param('projectId') projectId: string,
    @Req() req: Request,
  ) {
    const token = req.cookies?.token;
    const { sub } = this.jwtService.verify(token);
    return this.contentService.getAllContents(projectId, sub);
  }

  @Post(':projectId/generate-readme')
  async generateReadme(
    @Param('projectId') projectId: string,
    @Body() body: GenerateReadmeDto,
    @Req() req: Request,
  ) {
    const token = req.cookies?.token;
    const { email: userMail, sub: userId } = this.jwtService.verify(token);
    console.log(`POST ${projectId}/generate-read By ${userMail}`);
    return this.contentService.generateReadme(
      projectId,
      userMail,
      body.sections,
    );
  }

  @Put(':projectId/save')
  async saveContent(
    @Param('projectId') projectId: string,
    @Body() body: SaveContentDto,
    @Req() req: Request,
  ) {
    const token = req.cookies?.token;
    const { sub } = this.jwtService.verify(token);
    await this.contentService.saveContent(
      projectId,
      sub,
      body.contentName,
      body.contentType,
      body.content,
    );
  }

  @Post(':contentId/download')
  async downloadContent(
    @Param('contentId') contentId: string,
    @Res() res: Response,
  ) {
    return this.contentService.downloadContent(contentId, res);
  }

  @Delete(':contentId')
  async deleteById(@Param('contentId') contentId: string) {
    await this.contentService.deleteContentById(contentId);
  }

  @Post(':projectId/content/:contentId')
  async getContentByProject(
    @Req() req: Request,
    @Param('projectId') projectId: string,
    @Param('contentId') contentId: string,
  ) {
    const token = req.cookies?.token;
    const { sub } = this.jwtService.verify(token);
    const { data } = await this.contentService.getAllContents(projectId, sub);
    const content = data.contents.filter(
      (content) => String(content._id) === contentId,
    );
    return { data: content };
  }
}
