import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterAccountDto } from './dtos/register-account.dto';
import { AuthService } from './auth.service';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerAccount(@Body() body: RegisterAccountDto) {
    return this.authService.registerAccount(
      body.name,
      body.email,
      body.password,
    );
  }

  @Post('verify')
  verifyAccount(@Body() body: VerifyAccountDto) {
    return this.authService.verifyAccount(body.otp, body.email);
  }

  @Post('login')
  @HttpCode(200)
  loginAccount(@Body() body: LoginAccountDto) {
    return this.authService.loginAndSendJwt(body.email, body.password);
  }
}
