import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-task.dto';
import { ApiQuery } from '@nestjs/swagger';

const StatusSwaggerObject = {
  name: 'status',
  required: false,
  type: String,
  description: 'Filter tasks by status (OPEN, IN_PROGRESS, DONE)',
};
const SearchSwaggerObject = {
  name: 'search',
  required: false,
  type: String,
  description: 'Search tasks by title or description',
};

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiQuery(StatusSwaggerObject)
  @ApiQuery(SearchSwaggerObject)
  findAll(@Query() filterDto: FilterTasksDto) {
    return this.taskService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id/status') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
