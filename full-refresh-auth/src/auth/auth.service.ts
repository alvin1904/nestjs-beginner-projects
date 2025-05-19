import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterReqDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt.util';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { generateAccessAndRefreshTokens } from 'src/common/utils/session-tokens.util';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerReqBody: RegisterReqDto) {
    const { name, email, password } = registerReqBody;

    const userExists = await this.userModel.findOne({ email });
    if (userExists)
      throw new BadRequestException('User with that email already exists');

    const newUser = new this.userModel({
      name,
      email,
      password: await hashPassword(password),
    });

    await newUser.save();

    return { message: 'Registered successfully' };
  }

  async verifyAndReturnUserPayload(emailAddress: string, password: string) {
    const user = await this.userModel.findOne({ email: emailAddress });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) throw new UnauthorizedException('Invalid credentials');

    const { _id, name, email } = user;
    return { _id, name, email };
  }

  async login(user: User, response: Response) {
    if (!user) throw new ForbiddenException();

    const userPayload = { _id: user._id, name: user.name, email: user.email };
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = generateAccessAndRefreshTokens(this.jwtService, userPayload);
    const isInProduction = this.configService.get('NODE_ENV') === 'production';

    await this.userService.updateUser(
      { _id: user._id },
      { $set: { refreshToken: await hashPassword(refreshToken) } },
    );

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isInProduction,
      expires: accessTokenExpires,
      sameSite: 'lax',
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isInProduction,
      expires: refreshTokenExpires,
      sameSite: 'lax',
    });

    return { message: 'Logged in successfully' };
  }
}
