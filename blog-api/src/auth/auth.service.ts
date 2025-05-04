import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    console.log(loginDto);
    return `This action logs in the user`;
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
