import { BadRequestException, HttpStatus, type ValidationError } from '@nestjs/common';
import type { ApiErrorResponse } from './api-error-response.interface';
import type { FieldError } from './field-error.interface';

export function createValidationException(validationErrors: ValidationError[]): BadRequestException {
  const response: ApiErrorResponse = {
    statusCode: HttpStatus.BAD_REQUEST,
    code: 'VALIDATION_ERROR',
    message: 'Request validation failed',
    errors: flattenValidationErrors(validationErrors),
  };

  return new BadRequestException(response);
}

function flattenValidationErrors(validationErrors: ValidationError[], parentField = ''): FieldError[] {
  return validationErrors.flatMap(({ property, constraints, children = [] }) => {
    const field = parentField ? `${parentField}.${property}` : property;
    const constraintErrors = Object.entries(constraints ?? {}).map(([constraint, message]) => ({
      field,
      code: normalizeConstraintCode(constraint),
      message,
    }));

    return [...constraintErrors, ...flattenValidationErrors(children, field)];
  });
}

function normalizeConstraintCode(constraint: string): string {
  return constraint
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toUpperCase();
}
