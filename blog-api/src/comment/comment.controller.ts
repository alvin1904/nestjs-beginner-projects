import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/posts/:postId/comments')
  async create(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
  ) {
    return await this.commentService.create(
      req.user?.id,
      postId,
      createCommentDto,
    );
  }

  @Get('/posts/:postId/comments')
  async fetch(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.commentService.fetch({ postId, page, limit });
  }

  @Delete('/comments/:commentId')
  async remove(
    @Req() req: RequestWithUser,
    @Param('commentId') commentId: string,
  ) {
    return await this.commentService.remove(req.user?.id, commentId);
  }
}
