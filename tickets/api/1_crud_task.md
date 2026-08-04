# Ticket: Build Task CRUD APIs with NestJS

## Objective

Build a `task` module in the backend that provides basic CRUD APIs for Task.

For the current scope, data will be stored using hard-coded/in-memory data. Database integration is not required yet.

## Task Interface

Task uses the following structure:

```ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Implementation

### 1. Create the backend feature structure

Inside the `apis` directory, create the following folder:

```text
apis/
└── features/
    └── task/
```

Generate a NestJS module for `task`.

Expected structure:

```text
apis/
└── features/
    └── task/
        ├── task.module.ts
        ├── task.controller.ts
        └── task.service.ts
```

### 2. Create hard-coded Task data

In `TaskService`, create a temporary list of Tasks to be used by the APIs.

Do not use a database in this ticket.

Example data:

```ts
[
  {
    id: "1",
    title: "Setup monorepo",
    description: "Setup pnpm workspace and Turborepo",
    completed: true,
    createdAt: "2026-08-04T00:00:00.000Z",
    updatedAt: "2026-08-04T00:00:00.000Z",
  },
];
```

### 3. Implement the API to get the Task list

```http
GET /tasks
```

Requirements:

- Return the current list of Tasks.
- The response must follow the `Task` interface.

### 4. Implement the API to create a Task

```http
POST /tasks
```

Request body:

```json
{
  "title": "Build Task APIs",
  "description": "Implement CRUD APIs for Task",
  "completed": false
}
```

The backend should generate:

- `id`
- `createdAt`
- `updatedAt`

The new Task should be added to the current in-memory list.

### 5. Implement the API to update a Task

```http
PATCH /tasks/:id
```

Allow the following fields to be updated:

- `title`
- `description`
- `completed`

When a Task is updated:

- Keep the existing `id`.
- Keep the existing `createdAt`.
- Update `updatedAt`.

If no Task is found with the provided `id`, the API should return an appropriate error.

### 6. Implement the API to delete a Task

```http
DELETE /tasks/:id
```

Delete the Task from the in-memory list by `id`.

If the Task does not exist, the API should return an appropriate error.

### 7. Verify the APIs with Postman

Test at least the following flow:

```text
GET /tasks
→ Get the current Task list

POST /tasks
→ Create a new Task

GET /tasks
→ Verify that the new Task appears in the list

PATCH /tasks/:id
→ Update the Task

GET /tasks
→ Verify that the Task data has been updated

DELETE /tasks/:id
→ Delete the Task

GET /tasks
→ Verify that the Task has been removed from the list
```

## Acceptance Criteria

- The backend contains a `features/task` module.
- Task uses the defined interface.
- All 4 APIs are implemented:

  - `GET /tasks`
  - `POST /tasks`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`

- Data is stored using hard-coded/in-memory data.
- No database is used.
- The create API generates `id`, `createdAt`, and `updatedAt`.
- The update API updates `updatedAt`.
- The update and delete APIs handle the case where the Task does not exist.
- All 4 APIs can be successfully tested using Postman.
