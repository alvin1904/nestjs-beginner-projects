import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getProfile(id: string) {
    if (!id) throw new BadRequestException('Invalid user id');
    return await this.userModel.findById(id);
  }

  async updateUser(query: FilterQuery<User>, data: UpdateQuery<User>) {
    return this.userModel.findOneAndUpdate(query, data);
  }

  async saveRefreshToken(userId: Types.ObjectId, hashedRefreshToken: string) {
    return await this.updateUser(
      { _id: userId },
      { $set: { refreshToken: hashedRefreshToken } },
    );
  }
  async clearRefreshToken(userId: Types.ObjectId) {
    return await this.updateUser(
      { _id: userId },
      { $set: { refreshToken: '' } },
    );
  }
}
