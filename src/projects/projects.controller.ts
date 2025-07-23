// src/projects/projects.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Project } from './entities/project.entity';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({
    description: 'Project created successfully',
    type: Project,
  })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiOkResponse({
    description: 'Projects retrieved successfully',
    type: [Project],
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiOkResponse({
    description: 'Project retrieved successfully',
    type: Project,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
