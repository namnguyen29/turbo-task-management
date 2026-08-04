import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { Task } from './task.interface';

@Injectable()
export class TaskService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Setup monorepo',
      description: 'Setup pnpm workspace and Turborepo',
      completed: true,
      createdAt: '2026-08-04T00:00:00.000Z',
      updatedAt: '2026-08-04T00:00:00.000Z',
    },
  ];

  public findAll(): Task[] {
    return this.tasks;
  }

  public create(dto: CreateTaskDto): Task {
    const timestamp = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      ...dto,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.tasks.push(task);
    return task;
  }

  public update(id: string, dto: UpdateTaskDto): Task {
    const task = this.findById(id);
    const updatedTask: Task = {
      ...task,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.tasks = this.tasks.map((currentTask) => (currentTask.id === id ? updatedTask : currentTask));

    return updatedTask;
  }

  public remove(id: string): void {
    this.findById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  private findById(id: string): Task {
    const task = this.tasks.find((currentTask) => currentTask.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" was not found`);
    }

    return task;
  }
}
