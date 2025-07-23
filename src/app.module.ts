import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TodosModule } from './todos/todos.module';
import { ProjectcategoryModule } from './projectcategory/projectcategory.module';
import { CommentModule } from './comment/comment.module';

import { JwtAuthGuard } from './authentication/guards/jwt-auth.guard';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Update with your DB host
      port: 5432, // Default PostgreSQL port
      username: 'admin_user', // Update with your DB username
      password: 'mYpassW0rd2025', // Update with your DB password
      database: 'nest_next_project_bank', // Update with your DB name
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Make sure User entity is picked
      synchronize: true,
      autoLoadEntities: true, // Automatically load entities from all modules
      // synchronize: true, // Auto-create schema in development
      logging: true, // Optional: logs all queries
    }),
    AuthenticationModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    TodosModule,
    ProjectcategoryModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
