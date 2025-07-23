import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsJSON,
} from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'User first name',
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Unique username for the user',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @ApiPropertyOptional({
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail()
  @Length(5, 100)
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
  })
  @IsOptional()
  @IsString()
  @Length(7, 20)
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'User biography or description',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  bio?: string;

  @ApiPropertyOptional({
    description: 'URL or path to user avatar image',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'User job title',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  jobTitle?: string;

  @ApiPropertyOptional({
    description: 'User department',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  department?: string;

  @ApiPropertyOptional({
    description: 'User role in the system',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Current status of the user account',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'Whether the user email has been verified',
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({
    description: 'User preferences stored as JSON object',
  })
  @IsOptional()
  @IsJSON()
  preferences?: Record<string, any>;
}
