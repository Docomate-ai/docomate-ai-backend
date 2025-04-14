// src/b2/b2.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as B2 from 'backblaze-b2';
import { File as MulterFile } from 'multer';

@Injectable()
export class B2Service implements OnModuleInit {
  private b2: B2;
  private bucketId: string | undefined;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.bucketId = this.configService.get<string>('B2_BUCKET_ID');
    this.b2 = new B2({
      applicationKeyId: this.configService.get<string>('B2_APPLICATION_KEY_ID'),
      applicationKey: this.configService.get<string>('B2_APPLICATION_KEY'),
    });
    await this.b2.authorize();
  }

  async uploadFile(file: MulterFile): Promise<string> {
    const uploadUrlResponse = await this.b2.getUploadUrl({
      bucketId: this.bucketId,
    });
    const uploadUrl = uploadUrlResponse.data.uploadUrl;
    const uploadAuthToken = uploadUrlResponse.data.authorizationToken;

    const uploadResponse = await this.b2.uploadFile({
      uploadUrl,
      uploadAuthToken,
      fileName: file.originalname,
      data: file.buffer,
    });

    return uploadResponse.data.fileId;
  }

  async deleteFile(fileName: string): Promise<void> {
    const fileInfo = await this.b2.getFileInfoByName({
      bucketName: this.bucketId,
      fileName,
    });
    await this.b2.deleteFileVersion({
      fileName,
      fileId: fileInfo.data.fileId,
    });
  }
}
