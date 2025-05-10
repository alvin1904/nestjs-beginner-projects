import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.getOrThrow('MYSQL_HOST'),
          port: configService.getOrThrow('MYSQL_PORT'),
          database: configService.getOrThrow('MYSQL_DATABASE'),
          username: configService.getOrThrow('MYSQL_USERNAME'),
          password: configService.getOrThrow('MYSQL_PASSWORD'),
          autoLoadEntities: true,
          synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
