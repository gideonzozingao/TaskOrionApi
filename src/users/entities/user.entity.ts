import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Comment } from 'src/comment/entities/comment.entity';

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  TEAM_LEAD = 'team_lead',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  TESTER = 'tester',
  CLIENT = 'client',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ select: false }) // Hide password by default in queries
  password: string;

  @Column({ nullable: true, length: 20 })
  phoneNumber?: string;

  @Column({ nullable: true, length: 500 })
  bio?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true, length: 100 })
  jobTitle?: string;

  @Column({ nullable: true, length: 100 })
  department?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DEVELOPER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ nullable: true })
  passwordResetExpires?: Date;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true, length: 10 })
  timezone?: string;

  @Column({ nullable: true, length: 10 })
  language?: string;

  @Column({ type: 'json', nullable: true })
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      taskAssignment?: boolean;
      projectUpdates?: boolean;
      mentions?: boolean;
    };
    theme?: 'light' | 'dark' | 'system';
    dateFormat?: string;
    workingHours?: {
      start: string;
      end: string;
      workingDays: number[];
    };
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations

  // Projects owned by this user (as project manager)
  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  // Projects where user is a team member
  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];

  // Tasks assigned to this user
  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  // Tasks created by this user
  @OneToMany(() => Task, (task) => task.creator)
  createdTasks: Task[];

  // Comments made by this user
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  // Methods
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  canManageProjects(): boolean {
    return [UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(this.role);
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
