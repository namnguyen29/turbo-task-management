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
