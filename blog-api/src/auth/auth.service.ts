import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  RequestWithUser,
  UserDetailsInReq,
} from './interfaces/RequestWithUser';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private saltRounds = 10;

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email: username }],
      select: ['id', 'password'],
    });
    const isPasswordCorrect = user
      ? await compare(password, user.password)
      : false;

    if (!isPasswordCorrect || !user)
      throw new ForbiddenException('Invalid credentials');

    return { id: user.id } as UserDetailsInReq;
  }

  async findOne(id: string | undefined) {
    const user = await this.userRepository.findOne({
      where: [{ id }],
    });
    if (!id || !user) throw new ForbiddenException('User does not exist');

    return user;
  }

  login(req: RequestWithUser) {
    const userDetails = req.user;
    let accessToken: string | null = null;
    if (userDetails) accessToken = this.jwtService.sign(userDetails);

    return { accessToken, message: 'Login success' };
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const userExists = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (userExists)
      throw new BadRequestException('Username or email already exists');

    const user = new User(registerDto);
    const hashedPassword = await hash(password, this.saltRounds);
    Object.assign(user, { password: hashedPassword });

    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...payload } = newUser;
    return payload;
  }

  logout() {
    return { message: `Successful logout` };
  }
}
