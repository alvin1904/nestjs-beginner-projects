import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/posts/:postId/comments')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
  ) {
    return this.commentService.create(postId, createCommentDto);
  }

  @Get('/posts/:postId/comments')
  fetch(@Param('postId') postId: string) {
    return this.commentService.fetch(postId);
  }

  @Delete('/comments/:commentId')
  remove(@Param('commentId') commentId: string) {
    return this.commentService.remove(commentId);
  }
}
