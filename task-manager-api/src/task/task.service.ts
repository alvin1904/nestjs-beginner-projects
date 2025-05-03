import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus, UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  create(dto: CreateTaskDto) {
    const task = new Task(
      uuidv4(),
      dto.title,
      dto.description,
      TaskStatus.OPEN,
      new Date(),
    );
    this.tasks.push(task);
    return task;
  }

  findAll() {
    return this.tasks;
  }

  findOne(id: string) {
    const tasks = this.tasks.find((task) => task.id === id);
    if (!tasks)
      throw new HttpException('Tasks Not found', HttpStatus.NOT_FOUND);
    return tasks;
  }

  update(id: string, dto: UpdateTaskDto) {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (!index || index === -1)
      throw new HttpException('Task Not found', HttpStatus.NOT_FOUND);

    if (dto.status) this.tasks[index].status = dto.status;
    if (dto.title) this.tasks[index].title = dto.title;
    if (dto.description) this.tasks[index].description = dto.description;

    return this.tasks[index];
  }

  remove(id: string) {
    let removedTask: Task | null = null;
    this.tasks = this.tasks.filter((task) => {
      if (task.id === id) removedTask = task;
      return task.id !== id;
    });
    return removedTask;
  }
}
