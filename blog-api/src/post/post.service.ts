import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
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
    if (!userId || !user) throw new NotFoundException('User not found');

    const post = new Post({
      title: createPostDto.title,
      content: createPostDto.content || '',
      user,
    });
    return this.postRepo.save(post);
  }

  async findAll(options: {
    pageNumber: number;
    limitNumber: number;
    userId?: string;
  }) {
    const { pageNumber, limitNumber, userId } = options;

    const findAndCountOptions = {
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    } as FindManyOptions<Post>;
    if (userId) findAndCountOptions.where = { user: { id: userId } };

    const [posts, total] =
      await this.postRepo.findAndCount(findAndCountOptions);

    return {
      data: posts,
      total,
      pageNumber,
      pageCount: Math.ceil(total / limitNumber),
    };
  }

  async findOne(id: string) {
    if (!id) throw new BadRequestException('Invalid post id');

    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    if (!id) throw new BadRequestException('Invalid post id');

    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    Object.assign(post, {
      title: updatePostDto.title ?? post.title,
      content: updatePostDto.content ?? post.content,
    });

    return this.postRepo.save(post);
  }

  async remove(id: string) {
    if (!id) throw new BadRequestException('Invalid post id');

    const postToRemove = await this.postRepo.findOne({ where: { id } });
    if (!postToRemove) throw new BadRequestException('Post not found');

    return this.postRepo.remove([postToRemove]);
  }
}
