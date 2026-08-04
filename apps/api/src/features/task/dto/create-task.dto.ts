import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { CreateTaskInput } from '../task.interface';

export class CreateTaskDto implements CreateTaskInput {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsBoolean()
  completed: boolean;
}
