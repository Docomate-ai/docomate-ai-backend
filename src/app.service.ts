import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private initAt: number;
  constructor() {
    this.initAt = Date.now();
  }
  serverStatus() {
    const status = {
      name: 'Docomate AI Nest Server',
      description:
        'Docomate AI is a tool to create github readmes, documentation and to talk with open source github codebases.',
      initAt: this.initAt,
    };
    return { data: status };
  }
}
