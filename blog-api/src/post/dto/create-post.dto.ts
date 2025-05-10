import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(8, { message: 'Title must be min 8 characters long' })
  title: string;

  @IsString()
  @IsOptional()
  content?: string;
}
