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
  Query,
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

  @Get('user')
  @UseGuards(JWTAuthGuard)
  async findAllOfUser(
    @Req() req: RequestWithUser,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const userId = req.user?.id;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber <= 0 ||
      limitNumber <= 0
    ) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return await this.postService.findAll({ pageNumber, limitNumber, userId });
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber <= 0 ||
      limitNumber <= 0
    ) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return await this.postService.findAll({ pageNumber, limitNumber });
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(id);
    return { ...post, message: 'Post fetched successfully' };
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    await this.postService.update(id, updatePostDto);
    return { message: 'Post updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  async remove(@Param('id') id: string) {
    await this.postService.remove(id);
    return { message: 'Post removed successfully' };
  }
}
