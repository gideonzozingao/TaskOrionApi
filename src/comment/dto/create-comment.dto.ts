import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommentType, CommentStatus } from '../entities/comment.entity';

class MentionDto {
  @ApiProperty({ type: String })
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  display_name: string;

  @ApiProperty()
  position: number;
}

class AttachmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  @IsString()
  mime_type: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  thumbnail_url?: string;
}

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  raw_content?: string;

  @ApiProperty({ enum: CommentType, default: CommentType.COMMENT })
  @IsEnum(CommentType)
  @IsOptional()
  type?: CommentType;

  @ApiProperty({ enum: CommentStatus, default: CommentStatus.ACTIVE })
  @IsEnum(CommentStatus)
  @IsOptional()
  status?: CommentStatus;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_private?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_internal?: boolean;

  @ApiPropertyOptional({ type: [MentionDto] })
  @ValidateNested({ each: true })
  @Type(() => MentionDto)
  @IsArray()
  @IsOptional()
  mentions?: MentionDto[];

  @ApiPropertyOptional({ type: [AttachmentDto] })
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsArray()
  @IsOptional()
  attachments?: AttachmentDto[];

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ type: [Object] })
  @IsArray()
  @IsOptional()
  reactions?: any[];

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  author_id?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  task_id?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  project_id?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  parent_comment_id?: string;
}
