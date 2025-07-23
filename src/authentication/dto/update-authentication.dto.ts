import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenticationDto } from './create-authentication.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuthenticationDto extends PartialType(
  CreateAuthenticationDto,
) {
  @ApiPropertyOptional({
    example: 'Jane',
    description: 'Updated first name of the user',
  })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Updated last name of the user',
  })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'jane_doe',
    description: 'Updated username of the user',
  })
  username?: string;
}
