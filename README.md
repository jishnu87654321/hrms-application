# Centralized Employee Database HRMS

An advanced HRMS admin system for managing employee records with PostgreSQL, Express, and React.

## Features
- **Centralized Database**: Full-time and Intern management.
- **Bulk Import**: Smooth CSV upload with row-wise validation.
- **Advanced Dashboard**: Real-time stats and team distribution.
- **Security**: JWT role-based access (Admin/HR).
- **Audit Logs**: Track every single change in the system.
- **Trash Bin**: Soft-delete and restore functionality.
- **Enterprise UI**: Premium shadcn-like design with Framer Motion animations.

## Tech Stack
- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + Lucide + Recharts
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (via Prisma ORM)
- **Validation**: Zod (Frontend & Backend)

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or AWS RDS)

### 2. Backend Setup
1. `cd backend`
2. Create `.env` from `.env.example` and add your `DATABASE_URL` and `JWT_SECRET`.
3. `npm install`
4. `npx prisma migrate dev --name init` (Requires DB connection)
5. `npm run seed` (Creates admin@hrms.com / admin123)
6. `npm run dev`

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Default Admin Credentials
- **Email**: `admin@hrms.com`
- **Password**: `admin123`

## Directory Structure
```
├── backend/
│   ├── prisma/             # Schema & Seeds
│   └── src/
│       ├── controllers/    # Business Logic
│       ├── routes/         # API Endpoints
│       ├── middleware/     # Auth & Guards
│       └── utils/          # Helpers (JWT, Zod)
├── frontend/
│   ├── src/
│   │   ├── pages/          # Dashboard, Employees, etc.
│   │   ├── layouts/        # Sidebar & Navbar
│   │   ├── services/       # API Communications
│   │   └── context/        # Auth State
```

## CSV Import Format
The system expects a CSV with these headers:
`fullName, role, employmentType, phoneNumber, email, employeeCode, dateOfJoining, department`

Valid `employmentType`: `FULL_TIME` or `INTERN`.
`department` must match existing departments (Engineering, HR, Marketing, etc.) in the database.
