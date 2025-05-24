/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/common/utils/session-tokens.util';

// This file defines how incoming JWT tokens are validated and how the user object is extracted from them.
// It's part of Passport's strategy system and allows NestJS to automatically authenticate and attach req.user
// when a route is protected using the JwtAuthGuard.

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    function extractorFunction(request: Request) {
      return request?.cookies?.['access_token'] as string;
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractorFunction]),
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    });
  }

  validate(payload: TokenPayload) {
    // No DB lookup needed as the token is short-lived and contains all required user data
    return payload;
  }
}
