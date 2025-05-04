import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { DatabaseModule } from './common/modules/DatabaseModule';
import { EnvironmentModule } from './common/modules/EnvironmentModule';

@Module({
  imports: [
    EnvironmentModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
