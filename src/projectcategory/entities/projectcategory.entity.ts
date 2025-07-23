import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('project_categories')
@Tree('nested-set')
@Index(['name'])
@Index(['slug'])
@Index(['status'])
export class ProjectCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true, length: 7 })
  color?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  cover_image?: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: false })
  is_default: boolean; // Default category for new projects

  @Column({ default: true })
  is_visible: boolean; // Show/hide from category lists

  @Column({ type: 'json', nullable: true })
  metadata?: {
    department?: string;
    business_unit?: string;
    default_budget?: number;
    default_duration?: number; // in days
    required_fields?: string[];
    allowed_roles?: string[];
    templates?: string[];
    custom_attributes?: Record<string, any>;
  };

  @Column({ type: 'json', nullable: true })
  settings?: {
    auto_assign_owner?: boolean;
    require_approval?: boolean;
    allow_public_projects?: boolean;
    max_projects_per_user?: number;
    default_project_status?: string;
    allowed_roles?: string[];
    notification_settings?: {
      on_project_create?: boolean;
      onProject_complete?: boolean;
      on_member_add?: boolean;
    };
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations

  // Creator of this category
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_dd' })
  created_by?: User;

  @Column({ nullable: true })
  created_by_id?: string;

  // Projects in this category
  @OneToMany(() => Project, (project) => project.category)
  projects: Project[];

  // Tree structure for nested categories
  @TreeChildren()
  children: ProjectCategory[];

  @TreeParent()
  parent: ProjectCategory;

  // Virtual properties
  get isActive(): boolean {
    return this.status === CategoryStatus.ACTIVE;
  }

  get hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }

  get projectCount(): number {
    return this.projects?.length || 0;
  }

  get fullPath(): string {
    // This would build the full category path like "Parent > Child > Grandchild"
    const buildPath = (
      category: ProjectCategory,
      path: string[] = [],
    ): string[] => {
      path.unshift(category.name);
      return category.parent ? buildPath(category.parent, path) : path;
    };
    return buildPath(this).join(' > ');
  }

  get level(): number {
    let level = 0;
    let current = this.parent;
    while (current) {
      level++;
      current = current.parent;
    }
    return level;
  }

  // Methods
  isDescendantOf(category: ProjectCategory): boolean {
    let current = this.parent;
    while (current) {
      if (current.id === category.id) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  isAncestorOf(category: ProjectCategory): boolean {
    return category.isDescendantOf(this);
  }

  getAllDescendants(): ProjectCategory[] {
    const descendants: ProjectCategory[] = [];

    const collectDescendants = (category: ProjectCategory) => {
      if (category.children) {
        for (const child of category.children) {
          descendants.push(child);
          collectDescendants(child);
        }
      }
    };

    collectDescendants(this);
    return descendants;
  }

  canHaveProjects(): boolean {
    return this.status === CategoryStatus.ACTIVE && this.is_visible;
  }

  canUserCreateProject(userId: string): boolean {
    if (!this.settings?.allowed_roles) return true;
    return this.canHaveProjects();
  }

  getDefaultProjectSettings(): Record<string, any> {
    return {
      status: this.settings?.default_project_status || 'planning',
      budget: this.metadata?.default_budget,
      estimatedDuration: this.metadata?.default_duration,
      requiredFields: this.metadata?.required_fields || [],
    };
  }

  activate(): void {
    this.status = CategoryStatus.ACTIVE;
    this.is_visible = true;
  }

  deactivate(): void {
    this.status = CategoryStatus.INACTIVE;
    this.is_visible = false;
  }

  archive(): void {
    this.status = CategoryStatus.ARCHIVED;
    this.is_visible = false;
  }

  moveTo(newParent: ProjectCategory): void {
    // Prevent circular references
    if (
      newParent &&
      (newParent.id === this.id || newParent.isDescendantOf(this))
    ) {
      throw new Error('Cannot move category to itself or its descendant');
    }
    this.parent = newParent;
  }

  updateSortOrder(order: number): void {
    this.sort_order = order;
  }

  clone(newName: string, newSlug: string): Partial<ProjectCategory> {
    return {
      name: newName,
      slug: newSlug,
      description: this.description,
      color: this.color,
      icon: this.icon,
      metadata: { ...this.metadata },
      settings: { ...this.settings },
      parent: this.parent,
      created_by_id: this.created_by_id,
    };
  }
}
