import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!userId || !user) throw new ForbiddenException('User not found');

    const post = new Post({
      title: createPostDto.title,
      content: createPostDto.content || '',
      user,
    });
    return this.postRepo.save(post);
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: string) {
    if (!id) throw new BadRequestException('Invalid post id');
    return this.postRepo.findOne({ where: { id } });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    if (!id) throw new BadRequestException('Invalid post id');
    return `This action updates a #${id} post`;
  }

  async remove(id: string) {
    if (!id) throw new BadRequestException('Invalid post id');
    const postToRemove = await this.postRepo.findOne({ where: { id } });
    if (!postToRemove) throw new BadRequestException('Post not found');
    return this.postRepo.remove([postToRemove]);
  }
}
