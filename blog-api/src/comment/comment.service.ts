import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async create(
    userId: string | undefined,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    if (!userId || !isUUID(userId))
      throw new ForbiddenException('Invalid user ID');
    if (!postId || !isUUID(postId))
      throw new BadRequestException('Invalid post ID');

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found');

    if (!createCommentDto.content?.trim()) {
      throw new BadRequestException('Comment content cannot be empty');
    }

    const newComment = this.commentRepo.create({
      content: createCommentDto.content,
      post,
      user,
    });

    const savedComment = await this.commentRepo.save(newComment);

    return {
      message: 'Comment added successfully',
      data: savedComment,
    };
  }

  async fetch(options: { postId: string; page: number; limit: number }) {
    const { page, limit, postId } = options;

    if (!postId || !isUUID(postId))
      throw new BadRequestException('Invalid post id');

    const findAndCountOptions = {
      skip: (page - 1) * limit,
      take: limit,
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    } as FindManyOptions<Comment>;

    const [posts, total] =
      await this.commentRepo.findAndCount(findAndCountOptions);

    return {
      data: posts,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async remove(userId: string | undefined, commentId: string) {
    if (!userId || !isUUID(userId)) throw new ForbiddenException();
    if (!commentId || !isUUID(commentId))
      throw new BadRequestException('Invalid comment id');

    const commentToDelete = await this.commentRepo.findOne({
      where: { id: commentId, user: { id: userId } },
    });
    if (!commentToDelete) throw new NotFoundException('Comment not found');

    await this.commentRepo.remove([commentToDelete]);

    return { message: 'Comment deletion successful' };
  }
}
