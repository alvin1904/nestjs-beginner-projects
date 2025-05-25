import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterReqDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { Response } from 'express';
import { TokenPayload } from 'src/common/utils/session-tokens.util';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    @CurrentUser() user: TokenPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @CurrentUser() user: TokenPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: TokenPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(user, response);
  }
}
