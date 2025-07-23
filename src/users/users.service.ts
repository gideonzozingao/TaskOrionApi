import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Find all users with optional pagination and filtering
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string,
    status?: string,
  ): Promise<{
    data: User[];
    count: number;
    page: number;
    totalPages: number;
  }> {
    const take = Math.min(limit, 100); // enforce max 100 per page
    const skip = (page - 1) * take;

    const where: any = {};
    if (search) {
      where.username = ILike(`%${search}%`);
    }
    if (role) {
      where.role = role;
    }
    if (status) {
      where.status = status;
    }

    const [users, count] = await this.userRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: [
        'ownedProjects',
        'projects',
        'assignedTasks',
        'createdTasks',
        'comments',
      ],
    });

    return {
      data: users,
      count,
      page,
      totalPages: Math.ceil(count / take),
    };
  }

  /**
   * Find a single user by ID
   */
  async findOne(id: string | number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id as any },
      relations: [
        'ownedProjects',
        'projects',
        'assignedTasks',
        'createdTasks',
        'comments',
      ],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  /**
   * Get detailed profile of a user
   */
  async getProfile(id: string | number): Promise<User> {
    return this.findOne(id);
  }

  /**
   * Update user details
   */
  async update(
    id: string | number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Update user status
   */
  async updateStatus(id: string | number, status: string): Promise<User> {
    const user = await this.findOne(id);

    const validStatuses = Object.values(UserStatus);
    if (!validStatuses.includes(status as UserStatus)) {
      throw new BadRequestException(
        `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      );
    }

    user.status = status as UserStatus;
    return this.userRepository.save(user);
  }

  /**
   * Remove user by ID
   */
  async remove(id: string | number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'firstName', 'lastName'],
    });
  }
}
