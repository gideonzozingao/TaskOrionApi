import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateAuthenticationDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() createAuthDto: CreateAuthenticationDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'SecurePass123!' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.authService.login(email, password);
  }
}
