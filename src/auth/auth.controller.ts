import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterAccountDto } from './dtos/register-account.dto';
import { AuthService } from './auth.service';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { AuthGuard } from 'src/guards/authorized.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@Session() session: any) {
    const userName = await this.authService.whoAmI(session.token);
    return { message: `Hello, ${userName}` };
  }

  @Post('register')
  async registerAccount(@Body() body: RegisterAccountDto) {
    await this.authService.registerAccount(
      body.name,
      body.email,
      body.password,
    );

    return { message: 'Mail has been sent to your email' };
  }

  @Post('verify')
  async verifyAccount(@Body() body: VerifyAccountDto, @Session() session) {
    const token = this.authService.verifyAccount(body.otp, body.email);
    session.token = token;
    return { message: 'Account has been created' };
  }

  @Post('login')
  @HttpCode(200)
  async loginAccount(@Body() body: LoginAccountDto, @Session() session) {
    const token = await this.authService.loginAndSendJwt(
      body.email,
      body.password,
    );
    session.token = token;
    return { message: 'User logined successfully' };
  }

  @Delete('logout')
  async logoutAccount(@Session() session: any) {
    if (session.token) {
      delete session.token;
    }
    return { message: 'successfully logout' };
  }
}
