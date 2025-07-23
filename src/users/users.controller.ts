import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
// Query parameters interface
export interface FindAllQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

// Paginated response DTO
export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Users retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Array of users',
    type: [UserResponseDto],
  })
  data: UserResponseDto[];

  @ApiProperty({
    description: 'Total count of users',
    example: 100,
  })
  count: number;

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
      hasNext: true,
      hasPrev: false,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error response DTOs
export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: new Date(),
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/users',
  })
  path: string;
}

// Status update DTO
export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the user',
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    example: 'ACTIVE',
  })
  status: string;
}

@ApiTags('Users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user account with the provided information',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
    examples: {
      example1: {
        summary: 'Basic User',
        description: 'Example of creating a basic user',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john.doe@example.com',
          password: 'SecurePass123!',
          phoneNumber: '+1234567890',
          bio: 'Software engineer with 5 years of experience',
          jobTitle: 'Senior Developer',
          department: 'Engineering',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a paginated list of users with optional filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default: 1)',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 10, max: 100)',
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering users by name, username, or email',
    example: 'john',
    type: String,
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter by user role',
    example: 'USER',
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by user status',
    example: 'ACTIVE',
    type: String,
  })
  @ApiOkResponse({
    description: 'Users retrieved successfully',
    type: PaginatedUsersResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions',
    type: ErrorResponseDto,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'User found and returned successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
    example: {
      statusCode: 404,
      message: 'User with ID 1 not found',
      error: 'Not Found',
      timestamp: '2024-01-20T10:30:00.000Z',
      path: '/api/users/1',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates an existing user with partial data',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: Number,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data (all fields are optional)',
    examples: {
      example1: {
        summary: 'Update Profile',
        description: 'Example of updating user profile information',
        value: {
          firstName: 'Jane',
          lastName: 'Smith',
          bio: 'Updated biography',
          jobTitle: 'Lead Developer',
          preferences: {
            theme: 'dark',
            notifications: {
              email: true,
              push: false,
            },
          },
        },
      },
      example2: {
        summary: 'Update Status',
        description: 'Example of updating user status',
        value: {
          status: 'INACTIVE',
          isEmailVerified: true,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or user ID format',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to update this user',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Permanently deletes a user account',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully (no content returned)',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to delete this user',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Get(':id/profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves detailed profile information for a specific user',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update user status',
    description: 'Updates only the status of a specific user',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: Number,
  })
  @ApiBody({
    type: UpdateStatusDto,
    description: 'Status update data',
  })
  @ApiOkResponse({
    description: 'User status updated successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid status value',
    type: ErrorResponseDto,
  })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.usersService.updateStatus(id, updateStatusDto.status);
  }
}
