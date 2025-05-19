import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

export interface TokenPayload {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

function parseDuration(duration: string): number {
  const time = parseInt(duration);
  if (isNaN(time)) return 0;

  if (duration.endsWith('ms')) return time;
  if (duration.endsWith('s')) return time * 1000;
  if (duration.endsWith('m')) return time * 60 * 1000;
  if (duration.endsWith('h')) return time * 60 * 60 * 1000;
  if (duration.endsWith('d')) return time * 24 * 60 * 60 * 1000;

  return 0; // default to 0 if unrecognized
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export function generateAccessAndRefreshTokens(
  jwtService: JwtService,
  payload: TokenPayload,
) {
  try {
    const accessTokenExpiryMs = parseDuration(ACCESS_TOKEN_EXPIRY);
    const refreshTokenExpiryMs = parseDuration(REFRESH_TOKEN_EXPIRY);

    const now = Date.now();
    const accessTokenExpires = new Date(now + accessTokenExpiryMs);
    const refreshTokenExpires = new Date(now + refreshTokenExpiryMs);

    const accessToken = jwtService.sign(payload, {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwtService.sign(payload, {
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  } catch (err) {
    console.error(err);
    throw new InternalServerErrorException(
      'Error while creating session tokens',
    );
  }
}
