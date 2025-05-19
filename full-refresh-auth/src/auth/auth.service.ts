import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterReqDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt.util';
import { LoginReqDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async register(registerReqBody: RegisterReqDto) {
    const { name, email, password } = registerReqBody;

    try {
      const newUser = new this.userModel({
        name,
        email,
        password: await hashPassword(password),
      });

      await newUser.save();
    } catch (err) {
      if (err && err.errorResponse && err.errorResponse.code === 11000)
        throw new BadRequestException(
          'Could not create user with those credentials',
        );
      throw new InternalServerErrorException(
        'Something went wrong while creating user',
      );
    }

    return { message: 'Registered successfully' };
  }

  async login(loginReqBody: LoginReqDto) {
    const { email, password } = loginReqBody;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('Invalid credentials');

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) throw new BadRequestException('Invalid credentials');

    return { message: 'Logged in successfully' };
  }
}
