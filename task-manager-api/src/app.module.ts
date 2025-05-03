import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import EnvironmentModule from './modules/global/EnvironmentModule';

@Module({
  imports: [EnvironmentModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
