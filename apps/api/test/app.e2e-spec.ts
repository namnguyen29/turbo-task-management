/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { createValidationException } from './../src/common/errors/validation-error';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: createValidationException,
      }),
    );
    await app.init();
  });

  it('/tasks supports the CRUD flow', async () => {
    const tasks = await request(app.getHttpServer()).get('/tasks').expect(200);
    expect(tasks.body).toHaveLength(1);

    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Build Task APIs',
        description: 'Implement CRUD APIs for Task',
        completed: false,
      })
      .expect(201);

    expect(createdTask.body).toEqual({
      id: expect.any(String),
      title: 'Build Task APIs',
      description: 'Implement CRUD APIs for Task',
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    const updatedTask = await request(app.getHttpServer())
      .patch(`/tasks/${createdTask.body.id}`)
      .send({ completed: true })
      .expect(200);

    expect(updatedTask.body).toMatchObject({
      id: createdTask.body.id,
      title: 'Build Task APIs',
      completed: true,
      createdAt: createdTask.body.createdAt,
    });

    await request(app.getHttpServer()).delete(`/tasks/${createdTask.body.id}`).expect(204);

    const remainingTasks = await request(app.getHttpServer()).get('/tasks').expect(200);
    expect(remainingTasks.body).not.toContainEqual(expect.objectContaining({ id: createdTask.body.id }));
  });

  it('/tasks/:id returns 404 for a task that does not exist', async () => {
    await request(app.getHttpServer()).patch('/tasks/unknown').send({ completed: true }).expect(404);

    await request(app.getHttpServer()).delete('/tasks/unknown').expect(404);
  });

  it('/tasks rejects invalid and non-whitelisted input', async () => {
    const missingTitle = await request(app.getHttpServer()).post('/tasks').send({ completed: false }).expect(400);

    expect(missingTitle.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      errors: expect.arrayContaining([
        {
          field: 'title',
          code: 'IS_STRING',
          message: 'title must be a string',
        },
      ]),
    });

    const invalidTypes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 123, completed: 'false' })
      .expect(400);

    expect(invalidTypes.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      errors: expect.arrayContaining([
        {
          field: 'title',
          code: 'IS_STRING',
          message: 'title must be a string',
        },
        {
          field: 'completed',
          code: 'IS_BOOLEAN',
          message: 'completed must be a boolean value',
        },
      ]),
    });

    const unknownProperty = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Build Task APIs', completed: false, admin: true })
      .expect(400);

    expect(unknownProperty.body).toEqual({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      errors: [
        {
          field: 'admin',
          code: 'WHITELIST_VALIDATION',
          message: 'property admin should not exist',
        },
      ],
    });

    await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Build Task APIs',
        completed: false,
        id: 'custom-id',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
      })
      .expect(400);

    await request(app.getHttpServer()).patch('/tasks/1').send({ completed: 'yes' }).expect(400);

    await request(app.getHttpServer()).patch('/tasks/1').send({ id: 'custom-id' }).expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
