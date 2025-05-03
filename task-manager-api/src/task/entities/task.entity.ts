import { TaskStatus } from '../dto/update-task.dto';

export class Task {
  id: string;

  title: string;

  description: string;

  status: TaskStatus;

  createdAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
    createdAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
  }
}
