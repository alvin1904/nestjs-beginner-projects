import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentModule } from './common/modules/environment.module';
import { DatabaseModule } from './common/modules/database.module';

@Module({
  imports: [EnvironmentModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
