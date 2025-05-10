/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(id: string = '') {
    if (!id) throw new BadRequestException('Invalid user');
    const data = await this.userRepository.findOne({ where: [{ id }] });
    if (!data) throw new BadRequestException('User does not exist');
    const { password, ...user } = data;
    return { ...user, message: 'User profile fetched successfully' };
  }
}
