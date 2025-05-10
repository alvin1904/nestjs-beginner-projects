import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.create(req.user?.id || '', createPostDto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(id);
    if (!post) throw new BadRequestException('Post Not found');
    return { ...post, message: 'Post fetched successfully' };
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  async remove(@Param('id') id: string) {
    await this.postService.remove(id);
    return { message: 'Post removed successfully' };
  }
}
