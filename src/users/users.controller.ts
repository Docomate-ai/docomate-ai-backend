import { Body, Controller, Patch, Post, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('user')
  async getUserById(@Session() session) {
    const { sub } = this.jwtService.verify(session.token);
    const user = await this.userService.findById(sub);
    const urls = user?.urls.map((url) => ({ value: url }));
    const obj = {
      name: user?.name,
      email: user?.email,
      urls,
    };
    return { data: { user: obj } };
  }

  @Patch('update-user')
  async updateUserById(@Body() body: UpdateUserDto, @Session() session) {
    const { sub } = this.jwtService.verify(session.token);
    await this.userService.updateUserById(sub, body);
    return { message: 'User updated successfully' };
  }
}
