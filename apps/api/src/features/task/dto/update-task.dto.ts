import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { UpdateTaskInput } from '../task.interface';

export class UpdateTaskDto implements UpdateTaskInput {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
