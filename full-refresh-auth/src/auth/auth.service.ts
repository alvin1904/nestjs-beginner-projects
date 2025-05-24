import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterReqDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model, Types } from 'mongoose';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt.util';
import { CookieOptions, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  generateAccessAndRefreshTokens,
  TokenPayload,
} from 'src/common/utils/session-tokens.util';
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

  /**
   * Registers a new user by saving their details in the database.
   *
   * @param {RegisterReqDto} param0 - User registration data.
   * @param {string} param0.name - The user's name.
   * @param {string} param0.email - The user's email address.
   * @param {string} param0.password - The user's plaintext password.
   * @throws {BadRequestException} If a user with the given email already exists.
   * @returns {Promise<{ message: string }>} Success message.
   */
  async register({
    name,
    email,
    password,
  }: RegisterReqDto): Promise<{ message: string }> {
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

  /**
   * Validates a user's credentials and returns their basic payload.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's plaintext password.
   * @throws {UnauthorizedException} If the email or password is invalid.
   * @returns {Promise<{ _id: string, name: string, email: string }>} User payload.
   */
  async verifyCredentialsAndGetPayload(
    email: string,
    password: string,
  ): Promise<{ _id: Types.ObjectId; name: string; email: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { _id, name } = user;
    return { _id, name, email };
  }

  async verifyRefreshToken(refreshToken: string, payload: TokenPayload) {
    const user = await this.userModel.findOne({
      id: payload._id,
    });

    if (!user || !user.refreshToken) throw new ForbiddenException();

    const authenticated = await comparePassword(
      refreshToken,
      user.refreshToken,
    );
    if (!authenticated)
      throw new UnauthorizedException('Refresh token is not valid');

    const { email, name } = user;
    return { id: payload._id, email, name };
  }

  /**
   * Returns secure cookie options depending on the environment.
   *
   * @private
   * @returns {{ httpOnly: boolean, secure: boolean, sameSite: 'lax' }} Cookie configuration.
   */
  private getSecureCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
    };
  }
  /**
   * Sets access and refresh token cookies on the response.
   *
   * @private
   * @param {Response} response - The HTTP response object.
   * @param {string} accessToken - The JWT access token.
   * @param {Date} accessTokenExpires - Expiration time for the access token.
   * @param {string} refreshToken - The JWT refresh token.
   * @param {Date} refreshTokenExpires - Expiration time for the refresh token.
   */
  private setAuthCookies(
    response: Response,
    accessToken: string,
    accessTokenExpires: Date,
    refreshToken: string,
    refreshTokenExpires: Date,
  ) {
    const cookieOptions = this.getSecureCookieOptions();
    response.cookie('access_token', accessToken, {
      expires: accessTokenExpires,
      ...cookieOptions,
    });
    response.cookie('refresh_token', refreshToken, {
      expires: refreshTokenExpires,
      ...cookieOptions,
    });
  }

  /**
   * Clears authentication cookies from the response.
   *
   * @private
   * @param {Response} response - The HTTP response object.
   */
  private clearAuthCookies(response: Response) {
    const cookieOptions = this.getSecureCookieOptions();
    response.clearCookie('access_token', cookieOptions);
    response.clearCookie('refresh_token', cookieOptions);
  }

  /**
   * Logs the user in, generates tokens, sets cookies, and stores refresh token hash.
   *
   * @param {TokenPayload} user - Authenticated user payload.
   * @param {Response} response - The HTTP response object to set cookies on.
   * @throws {ForbiddenException} If no user payload is provided.
   * @returns {Promise<{ message: string }>} Success message.
   */
  async login(
    user: TokenPayload,
    response: Response,
  ): Promise<{ message: string }> {
    if (!user) throw new ForbiddenException();

    const userPayload = { _id: user._id, name: user.name, email: user.email };
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = generateAccessAndRefreshTokens(this.jwtService, userPayload);

    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.userService.saveRefreshToken(user._id, hashedRefreshToken);

    this.setAuthCookies(
      response,
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    );

    return { message: 'Logged in successfully' };
  }

  /**
   * Logs the user out by clearing refresh tokens and cookies.
   *
   * @param {TokenPayload} user - Authenticated user payload.
   * @param {Response} response - The HTTP response object.
   * @returns {Promise<{ message: string }>} Success message.
   */
  async logout(
    user: TokenPayload,
    response: Response,
  ): Promise<{ message: string }> {
    await this.userService.clearRefreshToken(user._id);

    this.clearAuthCookies(response);

    return { message: 'Logged out successfully' };
  }
}
