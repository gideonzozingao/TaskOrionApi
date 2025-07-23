// src/projects/dto/create-project.dto.ts
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsUUID,
  IsArray,
} from 'class-validator';
import {
  ProjectPriority,
  ProjectStatus,
  ProjectVisibility,
} from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @IsOptional()
  @IsEnum(ProjectVisibility)
  visibility?: ProjectVisibility;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsUUID()
  ownerId: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  members?: string[]; // Array of user IDs
}
