import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';

// User Role Enum
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

// User Status Enum
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// Notification Preferences
export class NotificationPreferences {
  @ApiProperty({
    description: 'Email notification preference',
    example: true,
  })
  email: boolean;

  @ApiProperty({
    description: 'Push notification preference',
    example: false,
  })
  push: boolean;

  @ApiProperty({
    description: 'SMS notification preference',
    example: true,
  })
  sms: boolean;
}

// User Preferences
export class UserPreferences {
  @ApiProperty({
    description: 'Theme preference',
    example: 'dark',
    enum: ['light', 'dark', 'auto'],
  })
  theme: string;

  @ApiProperty({
    description: 'Language preference',
    example: 'en',
  })
  language: string;

  @ApiProperty({
    description: 'Timezone preference',
    example: 'UTC',
  })
  timezone: string;

  @ApiProperty({
    description: 'Notification preferences',
    type: NotificationPreferences,
  })
  notifications: NotificationPreferences;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'User biography or description',
    example: 'Software engineer with 5 years of experience',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'User job title',
    example: 'Senior Developer',
    required: false,
  })
  jobTitle?: string;

  @ApiProperty({
    description: 'User department',
    example: 'Engineering',
    required: false,
  })
  department?: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Current user status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Whether user email is verified',
    example: true,
  })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'Whether user phone is verified',
    example: false,
  })
  isPhoneVerified: boolean;

  @ApiProperty({
    description: 'User preferences',
    type: UserPreferences,
    required: false,
  })
  preferences?: UserPreferences;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'User last login timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  lastLoginAt?: string;

  // Exclude password from response
  @Exclude()
  password: string;

  // Transform full name
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
