/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/common/utils/session-tokens.util';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    function extractorFunction(request: Request) {
      return request?.cookies?.['refresh_token'] as string;
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractorFunction]),
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.['refresh_token'];
    return await this.authService.verifyRefreshToken(refreshToken, payload);
  }
}
