# TaskOrion

## TaskOrion API services with Nest.js

### Project Outline and Feature

This **TaskOrionAPI** project is designed to help me master the core features of NestJS in a practical, hands-on way.

### Main Modules

- **Authentication Module**: Handles user registration, login, and JWT-based authentication.
- **Users Module**: Manages user profile data (optional but good practice).
- **Tasks Module**: Manages CRUD operations for tasks.

## Core Features

- **User Authentication (JWT)**: Secure authentication for all routes except signup and login.
- **Task Management (CRUD Operations)**:
    - Create a new task.
    - List all tasks for the user.
    - View individual task details.
    - Update task content/status.
    - Delete a task.
- **Validation**: All input (DTOs) validated for required fields and correct data formats.
- **Database Integration**: Integration with PostgreSQL using TypeORM or Prisma.
- **Modular Architecture**: Code-based separation into feature modules, providers, and controllers.
- **Error Handling**: Global exception filter for consistent error responses.
- **Authorization Guards**: Protect routes so only authenticated users can access/modify their data.
- **Config Management**: Manage sensitive config with the **NestJS ConfigModule **.
- **Swagger API Docs**: Automatic API documentation with Swagger (optional, for bonus learning).

## Step-by-Step Roadmap

## 1. **Project Initialization**

- Scaffold a new project: **`nest new TaskOrionApi`**
- Install dependencies: TypeORM, class-validator, passport, JWT packages

## 2. **Database Setup**

- Set up your ORM (TypeORM ) and PostgreSQL 
- Create basic User and Task entities/models

## 3. **Authentication Module**

- Create **`AuthModule`**, **`AuthService`**, and **`AuthController`**
- Implement signup and login endpoints
- Hash passwords with bcrypt
- Issue JWT on successful login
- Secure endpoints with JWT AuthGuard

## 4. **Users Module** *(optional but good practice)*

- Build basic user profile CRUD and retrieval endpoints

## 5. **Tasks Module**

- Generate **`TasksModule`**, **`TaskService`**, and **`TaskController`**
- Implement CRUD endpoints for tasks (Create, Read, Update, Delete)
- Ensure tasks are linked to the authenticated user
- Add fields like **`title`**, **`description`**, **`status`** (e.g., pending, completed)

## 6. **DTOs and Validation**

- Write Data Transfer Objects (DTOs) for each endpoint
- Use class-validator decorators for input validation

## 7. **Guards, Pipes, and Exception Filters**

- Implement authentication guards to protect endpoints
- Add pipes for data transformation and global validation
- Set up a global exception filter to handle errors consistently

## 8. **Configuration Management**

- Use the **`ConfigModule`** to manage environment variables for DB connection, JWT, etc.

## 9. **Swagger Documentation** *(optional, recommended)*

- Install and configure Swagger with decorators for API documentation

## 10. **Testing & Enhancements**

- Test each endpoint with a tool like Postman or Insomnia
- Add enhancements such as:
    - Task filtering/sorting
    - Pagination
    - More advanced user roles (admin, user)

## Recommended Work Order

1. Project setup & dependencies
2. Database connection & entities
3. Authentication module
4. Users module (if included)
5. Tasks module & CRUD
6. Validation & error handling
7. Guards, pipes, and exception filter
8. Config management
9. API documentation
10. Final touches: testing, enhancements, code cleanup

This step-by-step approach ensures me to build a **robust, real-world API** while covering all of NestJS’s core concepts.# TaskOrionApi


##  Next Step

 ### Build Advanced API services Fetures
  - Comments  and Task Enditing   and Progress History
  - Build Teams and Impplement team Members Onboarding 
  - Add Projects and task and all per team.or individual
  
  ### Front End and Client
    - Build a Client or UI with Nest Js and intgegrate with the API service