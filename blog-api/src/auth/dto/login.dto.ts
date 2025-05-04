import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Invalid username' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
