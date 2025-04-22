import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterAccountDto } from './dtos/register-account.dto';
import { AuthService } from './auth.service';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { AuthGuard } from 'src/guards/authorized.guard';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@Req() req: Request) {
    const token = req.cookies?.token;
    const userName = await this.authService.whoAmI(token);
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
  async verifyAccount(
    @Body() body: VerifyAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.verifyAccount(body.otp, body.email);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { message: 'Account has been created' };
  }

  @Post('login')
  @HttpCode(200)
  async loginAccount(
    @Body() body: LoginAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.loginAndSendJwt(
      body.email,
      body.password,
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { message: 'User logged in successfully' };
  }

  @Delete('logout')
  async logoutAccount(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Successfully logged out' };
  }
}
