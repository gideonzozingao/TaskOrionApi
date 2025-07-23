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
import { Project } from 'src/projects/entities/project.entity';

export enum CommentType {
  COMMENT = 'comment',
  STATUS_CHANGE = 'status_change',
  ASSIGNMENT = 'assignment',
  PRIORITY_CHANGE = 'priority_change',
  DUE_DATE_CHANGE = 'due_date_change',
  ATTACHMENT = 'attachment',
  MENTION = 'mention',
  SYSTEM = 'system',
  REVIEW = 'review',
  APPROVAL = 'approval',
}

export enum CommentStatus {
  ACTIVE = 'active',
  EDITED = 'edited',
  DELETED = 'deleted',
  HIDDEN = 'hidden',
  FLAGGED = 'flagged',
}

@Entity('comments')
@Index(['task_id', 'created_at'])
@Index(['project_id', 'created_at'])
@Index(['author_id'])
@Index(['type'])
@Index(['status'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  raw_content?: string; // Original markdown/rich text content

  @Column({
    type: 'enum',
    enum: CommentType,
    default: CommentType.COMMENT,
  })
  type: CommentType;

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.ACTIVE,
  })
  status: CommentStatus;

  @Column({ default: false })
  is_private: boolean; // Private comments visible only to project managers/admins

  @Column({ default: false })
  is_pinned: boolean; // Pin important comments to top

  @Column({ default: false })
  is_internal: boolean; // Internal team comments not visible to clients

  @Column({ type: 'json', nullable: true })
  mentions?: {
    user_id: string; // Fixed: was user_dd
    username: string;
    display_name: string;
    position: number; // Position in text where mention occurs
  }[];

  @Column({ type: 'json', nullable: true })
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
    mime_type: string;
    thumbnail_url?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  metadata?: {
    old_value?: any; // For tracking changes (status, priority, etc.)
    new_value?: any;
    change_field?: string;
    ip_address?: string;
    user_agent?: string;
    system_generated?: boolean;
    review_score?: number; // 1-5 for review comments
    approval_status?: 'approved' | 'rejected' | 'needs_changes'; // Fixed: was approval_atatus
    time_logged?: number; // Hours logged with this comment
    custom_data?: Record<string, any>;
  };

  @Column({ type: 'json', nullable: true })
  reactions?: {
    emoji: string;
    count: number;
    users: {
      user_id: string;
      username: string;
      added_at: Date;
    }[];
  }[];

  @CreateDateColumn()
  created_at: Date; // Fixed: removed optional modifier

  @Column({ nullable: true })
  edited_at?: Date;

  @Column({ nullable: true, type: 'text' })
  edited_reason?: string;

  @Column({ default: 0 })
  edit_count: number;

  @Column({ nullable: true })
  deleted_at?: Date;

  @Column({ nullable: true })
  deleted_by?: string;

  @Column({ nullable: true, type: 'text' })
  deleted_reason?: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations

  // Author of the comment
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ nullable: true })
  author_id?: string;

  // Task this comment belongs to
  @ManyToOne(() => Task, (task) => task.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task?: Task;

  @Column({ nullable: true })
  task_id?: string;

  // Project this comment belongs to (for project-level comments)
  @ManyToOne(() => Project, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ nullable: true })
  project_id?: string;

  // Parent comment (for threaded replies)
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment?: Comment;

  @Column({ nullable: true })
  parent_comment_id?: string;

  // Replies to this comment
  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  // Users who can see this private comment
  @ManyToMany(() => User)
  @JoinTable({
    name: 'comment_visibility',
    joinColumn: { name: 'comment_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  visibleTo: User[];

  // Comment edit history (if you want to track all edits)
  @OneToMany(() => CommentHistory, (history) => history.comment)
  editHistory: CommentHistory[];

  // Virtual properties
  get isDeleted(): boolean {
    return this.status === CommentStatus.DELETED;
  }

  get isEdited(): boolean {
    return this.status === CommentStatus.EDITED || this.edit_count > 0;
  }

  get isSystemGenerated(): boolean {
    return this.metadata?.system_generated || false;
  }

  get hasReplies(): boolean {
    return this.replies && this.replies.length > 0;
  }

  get replyCount(): number {
    return this.replies?.length || 0;
  }

  get totalReactions(): number {
    return (
      this.reactions?.reduce((total, reaction) => total + reaction.count, 0) ||
      0
    );
  }

  get isReview(): boolean {
    return this.type === CommentType.REVIEW;
  }

  get timeSinceCreated(): string {
    const now = new Date();
    // Fixed: Handle potentially undefined created_at
    if (!this.created_at) return 'unknown';

    const diffMs = now.getTime() - this.created_at.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return this.created_at.toLocaleDateString();
  }

  // Methods
  canBeViewedBy(user_id: string): boolean {
    // Public comments can be viewed by anyone
    if (!this.is_private && !this.is_internal) return true;

    // Author can always view their own comments
    if (this.author_id === user_id) return true;

    // Check if user is in visibility list for private comments
    if (this.is_private && this.visibleTo) {
      return this.visibleTo.some((user) => user.id === user_id);
    }

    return false;
  }

  canBeEditedBy(userId: string): boolean {
    // Only author can edit their comments (within time limit if needed)
    if (this.author_id !== userId) return false;
    if (this.isDeleted) return false;
    return true;
  }

  canBeDeletedBy(userId: string): boolean {
    // Author or system admin can delete
    return this.author_id === userId || this.isSystemGenerated;
  }

  addReaction(emoji: string, userId: string, username: string): void {
    if (!this.reactions) this.reactions = [];

    const existingReaction = this.reactions.find((r) => r.emoji === emoji);

    if (existingReaction) {
      // Check if user already reacted with this emoji
      const userReaction = existingReaction.users.find(
        (u) => u.user_id === userId,
      );
      if (!userReaction) {
        existingReaction.count++;
        existingReaction.users.push({
          user_id: userId, // Fixed: was userId
          username,
          added_at: new Date(),
        });
      }
    } else {
      this.reactions.push({
        emoji,
        count: 1,
        users: [
          {
            user_id: userId, // Fixed: was userId
            username,
            added_at: new Date(),
          },
        ],
      });
    }
  }

  removeReaction(emoji: string, userId: string): void {
    if (!this.reactions) return;

    const reactionIndex = this.reactions.findIndex((r) => r.emoji === emoji);
    if (reactionIndex === -1) return;

    const reaction = this.reactions[reactionIndex];
    const userIndex = reaction.users.findIndex((u) => u.user_id === userId);

    if (userIndex !== -1) {
      reaction.users.splice(userIndex, 1);
      reaction.count--;

      if (reaction.count === 0) {
        this.reactions.splice(reactionIndex, 1);
      }
    }
  }

  addMention(
    userId: string,
    username: string,
    displayName: string,
    position: number,
  ): void {
    if (!this.mentions) this.mentions = [];

    // Fixed: Changed userId to user_id to match interface
    if (!this.mentions.some((m) => m.user_id === userId)) {
      this.mentions.push({
        user_id: userId, // Fixed: was userId
        username,
        display_name: displayName,
        position,
      });
    }
  }

  addAttachment(attachment: {
    name: string;
    url: string;
    size: number;
    mimeType: string;
    thumbnailUrl?: string;
  }): void {
    if (!this.attachments) this.attachments = [];
    this.attachments.push({
      id: crypto.randomUUID(),
      name: attachment.name,
      url: attachment.url,
      size: attachment.size,
      mime_type: attachment.mimeType, // Fixed: convert mimeType to mime_type
      thumbnail_url: attachment.thumbnailUrl, // Fixed: convert thumbnailUrl to thumbnail_url
    });
  }

  removeAttachment(attachmentId: string): void {
    if (this.attachments) {
      this.attachments = this.attachments.filter(
        (att) => att.id !== attachmentId,
      );
    }
  }

  edit(newContent: string, reason?: string): void {
    // Store previous content in history if needed
    this.content = newContent;
    this.edited_at = new Date();
    this.edited_reason = reason;
    this.edit_count++;
    this.status = CommentStatus.EDITED;
  }

  softDelete(deletedBy: string, reason?: string): void {
    this.status = CommentStatus.DELETED;
    this.deleted_at = new Date();
    this.deleted_by = deletedBy;
    this.deleted_reason = reason;
  }

  restore(): void {
    this.status = CommentStatus.ACTIVE;
    this.deleted_at = undefined; // Fixed: changed from null to undefined
    this.deleted_by = undefined; // Fixed: changed from null to undefined
    this.deleted_reason = undefined; // Fixed: changed from null to undefined
  }

  pin(): void {
    this.is_pinned = true;
  }

  unpin(): void {
    this.is_pinned = false;
  }

  makePrivate(visibleToUsers: User[] = []): void {
    this.is_private = true;
    this.visibleTo = visibleToUsers;
  }

  makePublic(): void {
    this.is_private = false;
    this.visibleTo = [];
  }

  flagAsInappropriate(): void {
    this.status = CommentStatus.FLAGGED;
  }

  addToVisibilityList(user: User): void {
    if (!this.visibleTo) this.visibleTo = [];
    if (!this.visibleTo.some((u) => u.id === user.id)) {
      this.visibleTo.push(user);
    }
  }

  removeFromVisibilityList(userId: string): void {
    if (this.visibleTo) {
      this.visibleTo = this.visibleTo.filter((u) => u.id !== userId);
    }
  }

  createSystemComment(
    content: string,
    changeData?: {
      field: string;
      old_value: any;
      new_value: any;
    },
  ): Partial<Comment> {
    return {
      content,
      type: CommentType.SYSTEM,
      metadata: {
        system_generated: true,
        change_field: changeData?.field,
        old_value: changeData?.old_value, // Fixed: was change_Data
        new_value: changeData?.new_value,
      },
    };
  }
}

// Optional: Comment History Entity for tracking all edits
@Entity('comment_history')
export class CommentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true, type: 'text' })
  edit_reason?: string;

  @CreateDateColumn()
  edited_at: Date;

  @ManyToOne(() => Comment, (comment) => comment.editHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' }) // Fixed: was commentId
  comment: Comment;

  @Column()
  comment_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'edited_by_id' }) // Fixed: was edited_by_d
  edited_by: User;

  @Column()
  edited_by_id: string;
}
