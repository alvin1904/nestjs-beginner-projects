import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from './update-task.dto';

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
