import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
  });

  it('creates a task with generated metadata', () => {
    const task = service.create({
      title: 'Build Task APIs',
      description: 'Implement CRUD APIs for Task',
      completed: false,
    });

    expect(task).toEqual({
      id: expect.any(String),
      title: 'Build Task APIs',
      description: 'Implement CRUD APIs for Task',
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(service.findAll()).toContainEqual(task);
  });

  it('updates permitted fields while retaining immutable metadata', () => {
    const original = service.findAll()[0];
    const task = service.update(original.id, {
      title: 'Set up monorepo',
      completed: false,
    });

    expect(task).toMatchObject({
      id: original.id,
      title: 'Set up monorepo',
      completed: false,
      createdAt: original.createdAt,
    });
    expect(task.updatedAt).not.toBe(original.updatedAt);
  });

  it('deletes an existing task', () => {
    service.remove('1');

    expect(service.findAll()).toEqual([]);
  });

  it('throws a not-found error when updating or deleting an unknown task', () => {
    expect(() => service.update('unknown', { completed: true })).toThrow(NotFoundException);
    expect(() => service.remove('unknown')).toThrow(NotFoundException);
  });
});
