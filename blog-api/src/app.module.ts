import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import EnvironmentModule from './common/modules/EnvironmentModule';

@Module({
  imports: [EnvironmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
