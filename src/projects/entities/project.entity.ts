import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { ProjectCategory } from 'src/projectcategory/entities/projectcategory.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

export enum ProjectVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INTERNAL = 'internal',
}

@Entity('projects')
@Index(['name'])
@Index(['status'])
@Index(['startDate', 'endDate'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ unique: true, length: 50 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true, length: 10 })
  code?: string; // Project code like "PROJ-001"

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectPriority,
    default: ProjectPriority.MEDIUM,
  })
  priority: ProjectPriority;

  @Column({
    type: 'enum',
    enum: ProjectVisibility,
    default: ProjectVisibility.PRIVATE,
  })
  visibility: ProjectVisibility;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget?: number;

  @Column({ length: 3, nullable: true })
  currency?: string; // ISO currency code like "USD"

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number; // Progress percentage 0-100

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ type: 'json', nullable: true })
  tags?: string[];

  @Column({ type: 'json', nullable: true })
  customFields?: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  settings?: {
    allowTimeTracking?: boolean;
    requireTaskApproval?: boolean;
    autoCloseCompletedTasks?: boolean;
    notifyOnTaskUpdate?: boolean;
    defaultTaskPriority?: string;
    workingDays?: number[];
    workingHours?: {
      start: string;
      end: string;
    };
  };

  @Column({ default: false })
  isTemplate: boolean;

  @Column({ nullable: true })
  templateId?: string; // Reference to template if created from one

  @Column({ default: false })
  isArchived: boolean;

  @Column({ nullable: true })
  archivedAt?: Date;

  @Column({ nullable: true, type: 'text' })
  archivedReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations

  // Project owner/manager
  @ManyToOne(() => User, (user) => user.ownedProjects, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  // Project category
  @ManyToOne(() => ProjectCategory, (category) => category.projects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category?: ProjectCategory;

  @Column({ nullable: true })
  categoryId?: string;

  // Project members (team)
  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable({
    name: 'project_members',
    joinColumn: {
      name: 'projectId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  members: User[];

  // Tasks in this project
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  // Parent project (for sub-projects)
  @ManyToOne(() => Project, (project) => project.subProjects, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentProjectId' })
  parentProject?: Project;

  @Column({ nullable: true })
  parentProjectId?: string;

  // Sub-projects
  @OneToMany(() => Project, (project) => project.parentProject)
  subProjects: Project[];

  // Virtual properties
  get isActive(): boolean {
    return this.status === ProjectStatus.ACTIVE;
  }

  get isCompleted(): boolean {
    return this.status === ProjectStatus.COMPLETED;
  }

  get isOverdue(): boolean {
    if (!this.endDate) return false;
    return new Date() > this.endDate && !this.isCompleted;
  }

  get daysRemaining(): number | null {
    if (!this.endDate) return null;
    const today = new Date();
    const diffTime = this.endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get duration(): number | null {
    if (!this.startDate || !this.endDate) return null;
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Methods
  isUserMember(userId: string): boolean {
    return this.members?.some((member) => member.id === userId) || false;
  }

  isUserOwner(userId: string): boolean {
    return this.ownerId === userId;
  }

  canUserAccess(userId: string): boolean {
    if (this.visibility === ProjectVisibility.PUBLIC) return true;
    return this.isUserOwner(userId) || this.isUserMember(userId);
  }

  updateProgress(): void {
    // This would typically be calculated based on completed tasks
    // Implementation would depend on your business logic
  }

  addMember(user: User): void {
    if (!this.members) this.members = [];
    if (!this.isUserMember(user.id)) {
      this.members.push(user);
    }
  }

  removeMember(userId: string): void {
    if (this.members) {
      this.members = this.members.filter((member) => member.id !== userId);
    }
  }

  archive(reason?: string): void {
    this.isArchived = true;
    this.archivedAt = new Date();
    this.archivedReason = reason;
    this.status = ProjectStatus.ARCHIVED;
  }

  restore(): void {
    this.isArchived = false;
    this.archivedAt = undefined;
    this.archivedReason = undefined;
    this.status = ProjectStatus.PLANNING;
  }
}
