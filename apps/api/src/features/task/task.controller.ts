import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import type { Task } from '@repo/types/task';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public findAll(): Task[] {
    return this.taskService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public findById(@Param('id') id: string): Task {
    return this.taskService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() dto: CreateTaskDto): Task {
    return this.taskService.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Task {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public remove(@Param('id') id: string): void {
    this.taskService.remove(id);
  }
}
