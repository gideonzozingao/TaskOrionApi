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
import { Project } from 'src/projects/entities/project.entity';
import { Comment } from 'src/comment/entities/comment.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  TESTING = 'testing',
  DONE = 'done',
  CANCELLED = 'cancelled',
  BLOCKED = 'blocked',
  ON_HOLD = 'on_hold',
  CLOED = 'closed',
}

export enum TaskPriority {
  LOWEST = 'lowest',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  HIGHEST = 'highest',
  CRITICAL = 'critical',
}

export enum TaskType {
  TASK = 'task',
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement',
  EPIC = 'epic',
  STORY = 'story',
  SUBTASK = 'subtask',
  ISSUE = 'issue',
  MIGRATION = 'migration',
  INTEGRATION = 'integration',
}

@Entity('tasks')
@Index(['title'])
@Index(['status'])
@Index(['priority'])
@Index(['due_date'])
@Index(['project_id', 'status'])
@Index(['assignee_id', 'status'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ unique: true, length: 20 })
  task_number: string; // e.g., "TASK-001", "BUG-042"

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.TASK,
  })
  type: TaskType;

  @Column({ type: 'date', nullable: true })
  start_date?: Date;

  @Column({ type: 'date', nullable: true })
  due_date?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number; // Progress percentage 0-100

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  estimated_hours?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  actual_hours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_cost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  actual_cost: number;

  @Column({ type: 'json', nullable: true })
  tags?: string[];

  @Column({ type: 'json', nullable: true })
  labels?: {
    id: string;
    name: string;
    color: string;
  }[];

  @Column({ type: 'json', nullable: true })
  custom_fields?: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
    mime_type: string;
    uploaded_at: Date;
  }[];

  @Column({ type: 'json', nullable: true })
  checklist?: {
    id: string;
    title: string;
    completed: boolean;
    order: number;
  }[];

  @Column({ default: false })
  is_recurring: boolean;

  @Column({ type: 'json', nullable: true })
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    end_date?: Date;
    days_of_Week?: number[]; // for weekly: [1,2,3,4,5] = Mon-Fri
    day_of_Month?: number; // for monthly
    month_of_year?: number; // for yearly
  };

  @Column({ default: false })
  is_billable: boolean;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  hourly_rate?: number;

  @Column({ default: false })
  is_template: boolean;

  @Column({ nullable: true })
  template_id?: string;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ nullable: true })
  archived_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations

  // Project this task belongs to
  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  project_id: string;

  // User assigned to this task
  @ManyToOne(() => User, (user) => user.assignedTasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee?: User;

  @Column({ nullable: true })
  assignee_id?: string;

  // User who created this task
  @ManyToOne(() => User, (user) => user.createdTasks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creator_id: string;

  // Task reporter (who reported the bug/issue)
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reporterId' })
  reporter?: User;

  @Column({ nullable: true })
  reporter_id?: string;

  // Parent task (for subtasks)
  @ManyToOne(() => Task, (task) => task.subtasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentTaskId' })
  parent_task?: Task;

  @Column({ nullable: true })
  parent_task_id?: string;

  // Subtasks
  @OneToMany(() => Task, (task) => task.parent_task)
  subtasks: Task[];

  // Task dependencies (tasks that must be completed before this one)
  @ManyToMany(() => Task, (task) => task.dependents)
  @JoinTable({
    name: 'task_dependencies',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'dependsOnId', referencedColumnName: 'id' },
  })
  dependencies: Task[];

  // Tasks that depend on this task
  @ManyToMany(() => Task, (task) => task.dependencies)
  dependents: Task[];

  // Watchers (users who want to be notified about task updates)
  @ManyToMany(() => User)
  @JoinTable({
    name: 'task_watchers',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  watchers: User[];

  // Comments on this task
  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  // Virtual properties
  get isOverdue(): boolean {
    if (!this.due_date || this.isCompleted) return false;
    return new Date() > this.due_date;
  }

  get isCompleted(): boolean {
    return this.status === TaskStatus.DONE;
  }

  get isCancelled(): boolean {
    return this.status === TaskStatus.CANCELLED;
  }

  get isBlocked(): boolean {
    return this.status === TaskStatus.BLOCKED;
  }

  get daysUntilDue(): number | null {
    if (!this.due_date) return null;
    const today = new Date();
    const diffTime = this.due_date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get duration(): number | null {
    if (!this.start_date || !this.completed_at) return null;
    const diffTime = this.completed_at.getTime() - this.start_date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get completedChecklistItems(): number {
    return this.checklist?.filter((item) => item.completed).length || 0;
  }

  get totalChecklistItems(): number {
    return this.checklist?.length || 0;
  }

  get checklistProgress(): number {
    if (this.totalChecklistItems === 0) return 0;
    return (this.completedChecklistItems / this.totalChecklistItems) * 100;
  }

  get costVariance(): number {
    if (!this.estimated_cost) return 0;
    return this.actual_cost - this.estimated_cost;
  }

  get timeVariance(): number {
    if (!this.estimated_hours) return 0;
    return this.actual_hours - this.estimated_hours;
  }

  // Methods
  canBeCompletedBy(userId: string): boolean {
    return this.assignee_id === userId || this.creator_id === userId;
  }

  isUserWatching(userId: string): boolean {
    return this.watchers?.some((watcher) => watcher.id === userId) || false;
  }

  addWatcher(user: User): void {
    if (!this.watchers) this.watchers = [];
    if (!this.isUserWatching(user.id)) {
      this.watchers.push(user);
    }
  }

  removeWatcher(userId: string): void {
    if (this.watchers) {
      this.watchers = this.watchers.filter((watcher) => watcher.id !== userId);
    }
  }

  addDependency(task: Task): void {
    if (!this.dependencies) this.dependencies = [];
    if (!this.dependencies.some((dep) => dep.id === task.id)) {
      this.dependencies.push(task);
    }
  }

  removeDependency(taskId: string): void {
    if (this.dependencies) {
      this.dependencies = this.dependencies.filter((dep) => dep.id !== taskId);
    }
  }

  canStart(): boolean {
    if (!this.dependencies?.length) return true;
    return this.dependencies.every((dep) => dep.isCompleted);
  }

  complete(): void {
    this.status = TaskStatus.DONE;
    this.completed_at = new Date();
    this.progress = 100;
  }

  reopen(): void {
    this.status = TaskStatus.TODO;
    this.completed_at = undefined;
    this.progress = 0;
  }

  block(reason?: string): void {
    this.status = TaskStatus.BLOCKED;
    if (reason && this.custom_fields) {
      this.custom_fields.block_reason = reason;
    }
  }

  unblock(): void {
    if (this.status === TaskStatus.BLOCKED) {
      this.status = TaskStatus.TODO;
      if (this.custom_fields?.block_reason) {
        delete this.custom_fields.block_reason;
      }
    }
  }

  updateProgress(percentage: number): void {
    this.progress = Math.max(0, Math.min(100, percentage));

    // Auto-update status based on progress
    if (percentage === 100 && this.status !== TaskStatus.DONE) {
      this.complete();
    } else if (percentage > 0 && this.status === TaskStatus.TODO) {
      this.status = TaskStatus.IN_PROGRESS;
    }
  }

  logTime(hours: number, cost?: number): void {
    this.actual_hours += hours;
    if (cost) {
      this.actual_cost += cost;
    } else if (this.hourly_rate) {
      this.actual_cost += hours * this.hourly_rate;
    }
  }

  addAttachment(attachment: {
    name: string;
    url: string;
    size: number;
    mime_type: string;
  }): void {
    if (!this.attachments) this.attachments = [];
    this.attachments.push({
      id: crypto.randomUUID(),
      ...attachment,
      uploaded_at: new Date(),
    });
  }

  removeAttachment(attachmentId: string): void {
    if (this.attachments) {
      this.attachments = this.attachments.filter(
        (att) => att.id !== attachmentId,
      );
    }
  }

  addChecklistItem(title: string): void {
    if (!this.checklist) this.checklist = [];
    this.checklist.push({
      id: crypto.randomUUID(),
      title,
      completed: false,
      order: this.checklist.length,
    });
  }

  toggleChecklistItem(itemId: string): void {
    if (this.checklist) {
      const item = this.checklist.find((item) => item.id === itemId);
      if (item) {
        item.completed = !item.completed;
      }
    }
  }

  archive(): void {
    this.is_archived = true;
    this.archived_at = new Date();
  }

  restore(): void {
    this.is_archived = false;
    this.archived_at = undefined;
  }
}
