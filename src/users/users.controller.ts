import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Request, Response } from 'express';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from 'src/guards/authorized.guard';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('user')
  async getUserById(@Req() req: Request) {
    const token = req.cookies?.token;
    const { sub } = this.jwtService.verify(token);
    const user = await this.userService.findById(sub);

    const urls = user?.urls?.map((url) => ({ value: url })) || [];
    const obj = {
      name: user?.name,
      email: user?.email,
      urls,
    };

    return { data: { user: obj } };
  }

  @UseGuards(AuthGuard)
  @Patch('update-user')
  async updateUserById(@Body() body: UpdateUserDto, @Req() req: Request) {
    const token = req.cookies?.token;
    const { sub } = this.jwtService.verify(token);
    await this.userService.updateUserById(sub, body);
    return { message: 'User updated successfully' };
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePasswordById(
    @Body() body: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const token = req.cookies?.token;
    const { sub } = this.jwtService.verify(token);
    await this.userService.changePassword(
      sub,
      body.currentPassword,
      body.newPassword,
    );
    return { message: 'Password updated successfully' };
  }

  @Delete('delete')
  async deleteAccount(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.token;
    const { email } = this.jwtService.verify(token);
    await this.userService.deleteByMail(email);
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return { message: 'Account deleted successfully' };
  }
}
