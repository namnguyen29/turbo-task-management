# Task 3: Standardize API Error Responses

## Objective

Standardize the error response returned by the backend when a request is invalid, especially DTO validation errors.

Currently, when the request body does not match the DTO, NestJS `ValidationPipe` may return the default response:

```json
{
  "message": ["title must be a string", "completed must be a boolean value"],
  "error": "Bad Request",
  "statusCode": 400
}
```

This format works, but it is difficult for the frontend to handle errors by field and error type.

The backend will standardize the error response using the following contract:

```ts
interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  errors?: FieldError[];
}

interface FieldError {
  field: string;
  code: string;
  message: string;
}
```

Expected response example:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "errors": [
    {
      "field": "title",
      "code": "IS_STRING",
      "message": "title must be a string"
    },
    {
      "field": "completed",
      "code": "IS_BOOLEAN",
      "message": "completed must be a boolean value"
    }
  ]
}
```

---

## Step 1: Create API Error Types

Create a folder for error handling in the backend:

```text
apps/api/src/common/errors/
```

Create the following files:

```text
api-error-response.interface.ts
field-error.interface.ts
```

Define the error types:

```ts
export interface FieldError {
  field: string;
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  errors?: FieldError[];
}
```

For this task, these interfaces will remain inside the backend.

Moving them to a shared package will be handled in Task 4.

---

## Step 2: Customize ValidationPipe

Update the global `ValidationPipe` to use `exceptionFactory`.

Example:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      // Convert NestJS ValidationError[]
      // into ApiErrorResponse
    },
  }),
);
```

The `exceptionFactory` will convert errors from `class-validator` into the standard API error format.

---

## Step 3: Convert ValidationError to FieldError

For each validation error, extract:

```text
property     → field
constraint   → code
message      → message
```

For example, a `class-validator` error:

```ts
{
  property: 'title',
  constraints: {
    isString: 'title must be a string'
  }
}
```

Should be converted to:

```json
{
  "field": "title",
  "code": "IS_STRING",
  "message": "title must be a string"
}
```

The constraint name from `class-validator` should be normalized to uppercase format so that the frontend can handle it consistently.

For example:

```text
isString        → IS_STRING
isBoolean       → IS_BOOLEAN
isNotEmpty      → IS_NOT_EMPTY
maxLength       → MAX_LENGTH
```

The frontend should not need to parse the error message to identify the error type.

---

## Step 4: Throw BadRequestException with the Standard Format

After converting the validation errors, return:

```ts
throw new BadRequestException({
  statusCode: HttpStatus.BAD_REQUEST,
  code: "VALIDATION_ERROR",
  message: "Request validation failed",
  errors: fieldErrors,
});
```

The API response should follow this structure:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "errors": []
}
```

---

## Step 5: Test with Task APIs

Test invalid input cases using the existing Task APIs.

### Missing Required Field

Request:

```json
{
  "completed": false
}
```

Expected response:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "errors": [
    {
      "field": "title",
      "code": "IS_STRING",
      "message": "title must be a string"
    }
  ]
}
```

### Invalid Type

Request:

```json
{
  "title": 123,
  "completed": "false"
}
```

Expected response:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "errors": [
    {
      "field": "title",
      "code": "IS_STRING",
      "message": "title must be a string"
    },
    {
      "field": "completed",
      "code": "IS_BOOLEAN",
      "message": "completed must be a boolean value"
    }
  ]
}
```

### Unknown Property

When the DTO uses:

```ts
whitelist: true;
forbidNonWhitelisted: true;
```

Request:

```json
{
  "title": "Task 1",
  "completed": false,
  "unknownField": "test"
}
```

The API should return the same `ApiErrorResponse` format instead of using a different error structure.

---

## Acceptance Criteria

The task is complete when:

- DTO validation continues to work correctly.
- Invalid requests return HTTP `400`.
- Validation errors follow the `ApiErrorResponse` format.
- Each field validation error contains `field`, `code`, and `message`.
- The frontend can identify errors using `code` instead of parsing the error message.
- `whitelist` and `forbidNonWhitelisted` continue to work.
- Existing Task API business logic is not changed.
- Missing fields, invalid types, and unexpected properties are tested using Postman.

## Output

After Task 3, the backend will have a consistent API error flow:

```text
DTO Validation
      ↓
ValidationPipe
      ↓
ValidationError[]
      ↓
Error Formatter
      ↓
ApiErrorResponse
      ↓
Frontend
```
