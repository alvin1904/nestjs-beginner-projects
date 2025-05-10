import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  getProfile(@Req() req: RequestWithUser) {
    return this.userService.getProfile(req.user?.id);
  }
}
