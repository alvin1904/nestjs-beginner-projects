import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  create(postId: string, createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  fetch(id: string) {
    return `This action returns all comment`;
  }

  remove(id: string) {
    return `This action removes a #${id} comment`;
  }
}
