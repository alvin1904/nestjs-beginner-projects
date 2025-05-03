import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export enum TaskStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  OPEN = 'OPEN',
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
