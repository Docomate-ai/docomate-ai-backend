import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAccountDto } from './dtos/register-account.dto';
import { AuthService } from './auth.service';

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
}
