import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { JWTSessionModule } from 'src/common/modules/JWTSessionModule';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Post]), JWTSessionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
