import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTSessionModule } from 'src/auth/modules/JWTSessionModule';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Post]), JWTSessionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
