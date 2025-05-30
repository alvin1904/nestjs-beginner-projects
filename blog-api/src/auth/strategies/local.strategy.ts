import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' });
  }

  validate(username: string, password: string) {
    if (password === '')
      throw new UnauthorizedException('Please Provide The Password');
    return this.authService.validateUser(username, password);
  }
}
