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
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
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
} from '@nestjs/swagger';

import { ProjectcategoryService } from './projectcategory.service';
import { CreateProjectcategoryDto } from './dto/create-projectcategory.dto';
import { UpdateProjectcategoryDto } from './dto/update-projectcategory.dto';

ApiTags('projectcategory');
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('projectcategory')
export class ProjectcategoryController {
  constructor(
    private readonly projectcategoryService: ProjectcategoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new  Project Category',
  })
  @ApiBody({ description: 'Project Category creation data' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(@Body() createProjectcategoryDto: CreateProjectcategoryDto) {
    return this.projectcategoryService.create(createProjectcategoryDto);
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
  @ApiOkResponse({ description: 'Users retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findAll() {
    return this.projectcategoryService.findAll();
  }

  @ApiNotFoundResponse({ description: 'Project category is not found' })
  @Get(':id')
  findOne(@Param('id') id: ParseIntPipe) {
    return this.projectcategoryService.findOne(+id);
  }
  @ApiNotFoundResponse({ description: 'Project category is not found' })
  @Patch(':id')
  update(
    @Param('id') id: ParseIntPipe,
    @Body() updateProjectcategoryDto: UpdateProjectcategoryDto,
  ) {
    return this.projectcategoryService.update(+id, updateProjectcategoryDto);
  }
  @ApiNotFoundResponse({ description: 'Project category is not found' })
  @Delete(':id')
  remove(@Param('id') id: ParseIntPipe) {
    return this.projectcategoryService.remove(+id);
  }
}
