# Vacation Management Interface

A full-stack web application for managing employee vacation requests.  
Employees can submit requests; managers can review, approve, or reject them.

Additional Features to requirements :
- Pending requests can be edited or cancelled
- Requests with past start dates are not allowed
- Remaining vacation days balance displayed for requester and validator
- Filter on requesters allowed for validators
- ErrorView added 
---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| State management | Pinia |
| Routing | Vue Router 4 |
| HTTP client | Axios |
| Backend | Node.js + Express + TypeScript |
| ORM | TypeORM |
| Database | PostgreSQL 17 |
| Tests | Jest + Supertest (backend) · Vitest + Vue Test Utils (frontend) |

---

## Project Structure

```
vacation-management-interface/
├── backend/                  # Express API
│   ├── src/
│   │   ├── config/           # TypeORM DataSource
│   │   ├── controllers/      # Business logic
│   │   ├── entities/         # TypeORM entities (User, VacationRequest)
│   │   ├── routes/           # Express routers
│   │   ├── seed.ts           # Database seeder
│   │   ├── app.ts            # Express app (no DB init — testable)
│   │   └── index.ts          # Entry point (DB init + listen)
│   ├── tests/
│   │   └── vacations.test.ts # Integration tests (SQLite in-memory)
│   ├── .env.example
│   ├── jest.config.json
│   ├── package.json
│   └── tsconfig.json
├── src/                      # Vue frontend (Vite root)
│   ├── components/
│   │   ├── common/           # AppLayout, StatusBadge, EmptyState
│   │   ├── requester/        # VacationForm, RequestList, EditRequestModal
│   │   └── validator/        # RequestTable, FilterBar, RejectModal
│   ├── views/                # HomeView, RequesterView, ValidatorView, ErrorView
│   ├── stores/               # Pinia store
│   ├── services/             # Axios API calls
│   ├── router/               # Vue Router
│   └── types/                # Shared TypeScript interfaces
├── tests/                    # Frontend Vitest tests
├── docker-compose.yml        # Optional PostgreSQL container
├── vite.config.ts
└── package.json
```

---

## Prerequisites

- Node.js >= 18
- PostgreSQL 14+ (local install **or** Docker)

---

## Setup — Local PostgreSQL

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE vacation_management;"
```

### 2. Configure the backend environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` if your PostgreSQL credentials differ from the defaults (`postgres` / `postgres`).

### 3. Install backend dependencies & seed

```bash
cd backend
npm install
npm run seed
```

### 4. Start the backend

```bash
npm run dev
```

The API runs on **http://localhost:3000**.

### 5. Install frontend dependencies & start

Open a new terminal at the project root:

```bash
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**.

---

## Setup — Docker (PostgreSQL only)

If you do not have PostgreSQL installed locally, start it with Docker:

```bash
docker compose up -d
```

Then follow steps 2–5 above.

---

## Running Tests

From the project root — runs frontend (Vitest) then backend (Jest) in sequence:

```bash
npm test
```

Or separately:

```bash
# Frontend only (Vitest + Vue Test Utils)
npm test  # from root, stops after Vitest

# Backend only (Jest + Supertest, SQLite in-memory)
cd backend
npm test
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List all users |
| POST | `/api/vacations` | Submit a vacation request |
| GET | `/api/vacations` | Get all requests (validator) |
| GET | `/api/vacations?userId=x` | Get requests for a user |
| GET | `/api/vacations?status=Pending` | Filter by status |
| PATCH | `/api/vacations/:id` | Edit a pending request |
| PATCH | `/api/vacations/:id/approve` | Approve a request |
| PATCH | `/api/vacations/:id/reject` | Reject a request (comment required) |
| DELETE | `/api/vacations/:id` | Cancel a pending request |

---

## Technical Decisions

- **TypeORM `synchronize: true`** in development: the schema is auto-created from entities on first start, no migration step needed locally.
- **No authentication**: user selection on the home screen simulates login. The seeded users cover both roles (Requester / Validator).
- **Vite proxy**: the frontend proxies `/api` to `http://localhost:3000`, so no CORS issues in development.
- **SQLite in tests**: backend integration tests use an in-memory SQLite database via TypeORM so no real PostgreSQL instance is required to run tests.

---

## Known Limitations

- No real authentication or JWT tokens — the role system is illustrative.
- No pagination on the validator dashboard.
- No email notifications on status change.
- `synchronize: true` for TypeORM should be replaced with migrations before any production deployment.
