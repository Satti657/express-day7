# Express REST API

A RESTful API built with **Node.js**, **Express.js**, and **PostgreSQL**.

This project demonstrates CRUD (Create, Read, Update, Delete) operations, database integration, input validation, proper error handling, and a modular project structure using controllers, routes, and middleware.

---

## Features

- Create new users
- Get user details with assigned tasks
- Create new tasks
- View all tasks
- Update existing tasks
- Delete tasks
- PostgreSQL database integration
- Input validation
- Error handling
- RESTful API architecture
- Modular folder structure

---

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv
- JavaScript

---

## Requirements

Before running this project, make sure you have installed:

- Node.js
- PostgreSQL
- npm

---

## Project Structure

```text
express-day7/
│
├── controllers/
│   ├── taskController.js
│   └── userController.js
│
├── middleware/
│   ├── validateTask.js
│   └── validateUser.js
│
├── routes/
│   ├── taskRoutes.js
│   └── userRoutes.js
│
├── node_modules/
│
├── .env
├── .gitignore
├── db.js
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Open the project folder

```bash
cd express-day7
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=taskdb
PORT=3000
```

### 5. Start the server

```bash
node index.js
```

---

## Running the Server

After starting the server, the API will be available at:

```
http://localhost:3000
```

If the server starts successfully, you should see:

```text
Server running on port 3000
```

---

## API Endpoints

### Task Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### User Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users/:id` | Get user details with tasks |
| POST | `/users` | Create a new user |

---

## Example Requests

### Create User

**POST** `/users`

```json
{
  "name": "Ahmed",
  "email": "ahmed@test.com"
}
```

---

### Create Task

**POST** `/tasks`

```json
{
  "title": "Learn Express",
  "user_id": 1
}
```

---

### Update Task

**PUT** `/tasks/1`

```json
{
  "title": "Learn Express API",
  "completed": true
}
```

---

## Example Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Learn Express API",
    "completed": true,
    "user_id": 1
  }
}
```

---

## Error Response Example

```json
{
  "success": false,
  "message": "Task not found."
}
```

---

## Validation

This project validates:

- Required task title
- Required user name
- Required email
- Valid task ID
- Valid user ID
- Duplicate email addresses
- Proper error responses

---

## Testing

The API was tested using:

- VS Code REST Client
- Postman

All endpoints were successfully tested, including:

- Successful requests
- Invalid input
- Missing data
- Duplicate email
- Invalid IDs
- Resource not found

---

## Future Improvements

- Password Hashing (bcrypt)
- User Authentication
- JWT Authentication
- Protected Routes
- User Login
- User Registration
- Refresh Tokens
- Role-Based Authorization

---





