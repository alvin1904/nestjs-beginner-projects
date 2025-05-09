import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interfaces/RequestWithUser';
import { LocalGuard } from './guards/local.guard';
import { JWTStrategy } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: RequestWithUser) {
    return this.authService.login(req);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Get('logout')
  @UseGuards(JWTStrategy)
  logout() {
    return this.authService.logout();
  }
}
