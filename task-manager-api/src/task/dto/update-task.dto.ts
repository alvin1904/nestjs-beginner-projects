import { IsEnum } from 'class-validator';

export enum TaskStatus {
  'IN_PROGRESS',
  'DONE',
  'OPEN',
}
export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: 'IN_PROGRESS' | 'DONE' | 'OPEN';
}
