import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempUser } from 'src/entities';
import { CommunicationsModule } from 'src/communications/communications.module';
import { EmailService } from 'src/communications/email/email.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([TempUser]),
    CommunicationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
