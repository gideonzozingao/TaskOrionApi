import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsBoolean,
  IsJSON,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @ApiProperty()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @ApiProperty()
  @IsString()
  @Length(3, 50)
  username: string;

  @ApiProperty()
  @IsEmail()
  @Length(5, 100)
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(7, 20)
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 500)
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  jobTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  preferences?: Record<string, any>;
}
