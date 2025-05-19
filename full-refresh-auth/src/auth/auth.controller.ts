import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterReqDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { User } from 'src/user/schema/user.schema';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerReqBody: RegisterReqDto) {
    return await this.authService.register(registerReqBody);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }
}
