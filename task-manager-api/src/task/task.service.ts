import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus, UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { FilterTasksDto } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];
  private getCurrentTime(): Date {
    // Keeps business logic separate from runtime dependencies like Date.
    return new Date();
  }

  create(dto: CreateTaskDto) {
    const task = new Task(
      uuidv4(),
      dto.title,
      dto.description,
      TaskStatus.OPEN,
      this.getCurrentTime(),
    );
    this.tasks.push(task);
    return task;
  }

  findAll(filterTasksDto: FilterTasksDto) {
    let allTasks = this.tasks;

    const { status, search } = filterTasksDto;

    if (status) {
      allTasks = allTasks.filter((task) => task.status === status);
    }

    if (search) {
      allTasks = allTasks.filter((task) => {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regExp = new RegExp(escapedSearch, 'i'); // Case-insensitive search
        return regExp.test(task.title) || regExp.test(task.description);
      });
    }

    return allTasks;
  }

  findOne(id: string) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new HttpException('Task Not found', HttpStatus.NOT_FOUND);
    return task;
  }

  update(id: string, dto: UpdateTaskDto) {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1)
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
    if (!removedTask)
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    return removedTask;
  }
}
