import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow('JWT_EXPIRY'),
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JWTSessionModule {}
