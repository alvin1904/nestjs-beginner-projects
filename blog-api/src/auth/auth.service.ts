import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, email, password } = loginDto;
    if (!username && !email)
      throw new HttpException(
        'One of email or username must be provided',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    const isPasswordCorrect = user
      ? await compare(password, user.password)
      : false;

    if (!isPasswordCorrect || !user)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, payload };
  }

  async register(registerDto: RegisterDto) {
    const userExists = await this.userRepository.findOne({
      where: [{ email: registerDto.email }, { username: registerDto.username }],
    });
    if (userExists)
      throw new HttpException(
        'Username or email already exists',
        HttpStatus.BAD_REQUEST,
      );

    const saltRounds = 10;
    const hashedPassword = await hash(registerDto.password, saltRounds);

    const user = new User(registerDto);
    Object.assign(user, { password: hashedPassword });

    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);

    return newUser;
  }

  async logout() {
    return `This action logs out user`;
  }
}
