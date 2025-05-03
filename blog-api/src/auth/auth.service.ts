import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    return `This action logs in the user`;
  }

  register(registerDto: RegisterDto) {
    return `This action registers user`;
  }

  logout() {
    return `This action logs out user`;
  }
}
