import type { FieldError } from './field-error.interface';

export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  errors?: FieldError[];
}
