import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthenticationDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username of the user',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'User password (min 6 chars)',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  lastName: string;
}
