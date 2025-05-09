import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const secretOrKey = process.env.JWT_SECRET || '';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey,
    });
  }

  validate(payload: any) {
    console.log(payload);
  }
}
