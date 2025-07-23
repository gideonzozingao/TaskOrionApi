// src/projects/projects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { members, ownerId, ...projectData } = createProjectDto;

    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    }

    const project = this.projectRepository.create({ ...projectData, owner });

    if (members?.length) {
      const projectMembers = await this.userRepository.find({
        where: { id: In(members) },
      });
      project.members = projectMembers;
    }

    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['owner', 'members', 'tasks', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'tasks', 'category'],
    });
    if (!project)
      throw new NotFoundException(`Project with ID ${id} not found`);
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);

    const { members, ownerId, ...updateData } = updateProjectDto;
    Object.assign(project, updateData);

    if (ownerId) {
      const newOwner = await this.userRepository.findOne({
        where: { id: ownerId },
      });
      if (!newOwner)
        throw new NotFoundException(`Owner with ID ${ownerId} not found`);
      project.owner = newOwner;
    }

    if (members) {
      const updatedMembers = await this.userRepository.find({
        where: { id: In(members) },
      });
      project.members = updatedMembers;
    }

    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}
