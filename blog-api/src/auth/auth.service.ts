import { BadRequestException, Injectable } from '@nestjs/common';
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

  private saltRounds = 10;

  async login(loginDto: LoginDto) {
    const { username, email, password } = loginDto;
    if (!username && !email)
      throw new BadRequestException('One of email or username is required');

    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    const isPasswordCorrect = user
      ? await compare(password, user.password)
      : false;

    if (!isPasswordCorrect || !user)
      throw new BadRequestException('Invalid credentials');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...data } = user;
    const accessToken = this.jwtService.sign(data);

    return { accessToken, data };
  }

  async register(registerDto: RegisterDto) {
    const { username, email } = registerDto;

    const userExists = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (userExists)
      throw new BadRequestException('Username or email already exists');

    const hashedPassword = await hash(registerDto.password, this.saltRounds);

    const user = new User(registerDto);
    Object.assign(user, { password: hashedPassword });

    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...payload } = newUser;
    return payload;
  }

  async logout() {
    return `This action logs out user`;
  }
}
