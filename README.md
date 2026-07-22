# Employee Management System

Full-stack employee task management app with a React frontend and Node.js/Express/MongoDB backend.

## Project Structure

```
employee-management-system/
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   └── seedAdmin.js               # Creates the first admin from .env (only if none exists)
│   ├── controllers/
│   │   ├── authController.js         # Login, register, JWT
│   │   ├── employeeController.js     # Employee CRUD (admin)
│   │   └── taskController.js         # Task CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification (protect)
│   │   └── roleMiddleware.js         # Role-based authorization (adminOnly / authorize)
│   ├── models/
│   │   ├── Employee.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/Login.jsx
│   │   ├── Dashboard/AdminDashboard.jsx
│   │   ├── Dashboard/EmployeeDashboard.jsx
│   │   ├── others/ManageEmployees.jsx  # Admin: add/remove employees (uses /api/employees)
│   │   ├── others/CreateTask.jsx
│   │   ├── others/AllTask.jsx
│   │   ├── others/Header.jsx
│   │   ├── others/TaskListNumbers.jsx
│   │   └── TaskList/ (TaskList, NewTask, AcceptTask, CompleteTask, FailedTask)
│   ├── context/
│   │   └── AuthContext.jsx           # Logged-in user state (React Context)
│   ├── services/
│   │   └── api.js                    # Shared axios instance + auth token interceptor
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/employee_management`)

## Setup

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000` (auto-restarts on save via nodemon).

### 2. Frontend

In a separate terminal, from the project root:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. In dev, Vite proxies any request to `/api` through to the backend on port 5000 (see `vite.config.js`), so `src/services/api.js` uses a relative `/api` base URL and works without extra CORS config.

## First Login

Nothing is hardcoded or pre-seeded except a single admin account, and only if
one doesn't already exist. On first start, the server reads `ADMIN_NAME`,
`ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `backend/.env` and creates that admin
if no admin is in the database yet. Change those values in `.env` before your
first run (don't ship the defaults to production).

Everything else — employees and tasks — is created dynamically after that:

- Log in as admin, then use the **Manage Employees** panel on the admin
  dashboard to add employee accounts (name, email, temporary password).
- Use **Create Task** to assign tasks to any employee by name.

There's no separate seed script and no fake data baked into the code.

## API Endpoints

| Method | Endpoint                  | Description                    | Access        |
|--------|----------------------------|---------------------------------|---------------|
| POST   | /api/auth/login            | Login                          | Public        |
| POST   | /api/auth/register         | Register new user              | Public        |
| GET    | /api/auth/profile          | Get logged-in profile          | Authenticated |
| GET    | /api/tasks/all              | All employees + their tasks    | Admin         |
| GET    | /api/tasks/employee          | Logged-in employee's tasks     | Employee      |
| POST   | /api/tasks                 | Create/assign a task           | Admin         |
| PATCH  | /api/tasks/:id/accept       | Accept a task                  | Employee      |
| PATCH  | /api/tasks/:id/status        | Mark task completed/failed     | Employee      |
| GET    | /api/employees              | List all employees             | Admin         |
| GET    | /api/employees/:id           | Get one employee               | Admin         |
| POST   | /api/employees              | Create an employee record      | Admin         |
| PUT    | /api/employees/:id            | Update an employee             | Admin         |
| DELETE | /api/employees/:id            | Delete an employee + their tasks | Admin       |

> Note: `/api/employees` is a plain CRUD management API for admins, wired up to the **Manage Employees** panel on the admin dashboard. It's separate from `/api/auth/register`, which self-registers a new user and returns a login token.

## Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# First admin account — created automatically on server start if no admin exists yet.
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@me.com
ADMIN_PASSWORD=changeme123
```
