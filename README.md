# Online Task Manager

A Spring Boot-based web application for managing daily tasks. This application allows users to register, log in, and perform CRUD operations on their tasks, with filtering capabilities for upcoming and past tasks.

## Features

- **User Authentication:** Sign up and Login functionality.
- **Task Management:** Create, Read, Update (Status), and Delete tasks.
- **Task Filtering:** View all tasks, or filter by "Upcoming" and "Past" based on due dates.
- **Real-time Updates:** Dynamic task list rendering without page reloads.
- **Secure API:** Passwords are never sent back to the frontend (Write-only).

## Tech Stack

- **Backend:** Java 8+, Spring Boot 2.7.5, Spring Data JPA, Spring Security.
- **Database:** MySQL 8.0.
- **Frontend:** HTML5, CSS3 (Bootstrap 4.5), JavaScript (Vanilla ES6).
- **Build Tool:** Maven.

## Prerequisites

- Java Development Kit (JDK) 8 or higher.
- MySQL Server.
- Maven (or an IDE like IntelliJ/Eclipse/STS).

## Getting Started

### 1. Database Setup
Create a database named `taskmanager` in your MySQL server:
```sql
CREATE DATABASE taskmanager;
```

### 2. Configuration
Update the `src/main/resources/application.properties` file with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Running the Application
You can run the application using Maven:
```bash
mvn spring-boot:run
```
The application will start on **http://localhost:8181**.

## Default Credentials
For testing purposes, a default user is available:
- **Username:** `default`
- **Password:** `defaultpassword`

## API Endpoints

### Users
- `POST /api/users/signup` - Register a new user.
- `POST /api/users/login` - Authenticate and get user details.

### Tasks
- `GET /api/tasks` - Get all tasks for a user (Requires `User-ID` header).
- `POST /api/tasks` - Create a new task (Requires `User-ID` header).
- `PUT /api/tasks/{id}` - Update task status.
- `DELETE /api/tasks/{id}` - Delete a task.

## Project Structure
- `src/main/java`: Backend source code (Controllers, Services, Models, Repositories).
- `src/main/resources/static`: Frontend assets (HTML, CSS, JS).
- `src/main/resources/application.properties`: Application configuration.
