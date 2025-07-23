import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Todo } from 'src/todos/entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Todo])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
