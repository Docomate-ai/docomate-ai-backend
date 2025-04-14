import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CommunicationsModule } from './communications/communications.module';
import { AiModule } from './ai/ai.module';
import { ProjectsModule } from './projects/projects.module';
import { B2Module } from './b2/b2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    CommunicationsModule,
    AiModule,
    ProjectsModule,
    B2Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
