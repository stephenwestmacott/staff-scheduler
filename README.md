# Staff Scheduler

A modern full-stack web application for managing staff schedules with role-based assignments.

## Quick Start

**Prerequisites:** Docker and Docker Compose must be **installed and running**.  
Download Docker Desktop: https://www.docker.com/products/docker-desktop/

```bash
# Clone the repository
git clone https://github.com/stephenwestmacott/staff-scheduler

# Navigate to project directory
cd staff-scheduler

# Create environment file
cp .env.example .env

# Start all services
docker compose up -d --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
```

**⚠️ Note:** First Docker build can take several minutes. The frontend will load before MySQL initializes and show "Failed to fetch data" errors. After MySQL has initialized and pre-populated data, refresh the page and staff/shift data will appear.

**💡 Tip:** After the first build, use `docker compose down -v` to stop and `docker compose up -d` to restart (no rebuild needed).

## Mobile Testing

Access from any device on your Wi-Fi network:

1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Visit: `http://YOUR_IP:5173` from your mobile device
3. No configuration needed - automatic network detection!

## Technology Stack

**Backend:** PHP 8.3, Slim Framework 4, MySQL 8.0  
**Frontend:** React 19, Vite, Material-UI  
**Testing:** PHPUnit, Docker

## Features

- Staff management with role validation
- Shift scheduling and assignments
- Mobile-responsive design
- Real-time data updates
- Comprehensive input validation

## Testing

The application includes unit tests that validate core business logic and input validation.

```bash
# Run all unit tests from Docker
docker compose exec backend ./vendor/bin/phpunit tests/

# Run specific test suites from Docker
docker compose exec backend ./vendor/bin/phpunit tests/unit/StaffServiceTest.php
docker compose exec backend ./vendor/bin/phpunit tests/unit/ShiftServiceTest.php
docker compose exec backend ./vendor/bin/phpunit tests/unit/AssignmentServiceTest.php
```

**Test Coverage:**

- **StaffService**: Name validation, role validation, phone format validation
- **ShiftService**: Required field validation, creation scenarios
- **AssignmentService**: Staff/shift validation, duplicate prevention logic

All tests use mock repositories to isolate service logic and focus on validation behavior.

## API Endpoints

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| GET    | `/staff`       | List all staff   |
| POST   | `/staff`       | Create staff     |
| GET    | `/shifts`      | List shifts      |
| POST   | `/shifts`      | Create shift     |
| GET    | `/assignments` | List assignments |
| POST   | `/assign`      | Assign to shift  |

## Approach & Architecture

### Backend

- **Framework Choice**: Selected Slim Framework for its lightweight nature and rapid API development capabilities, perfect for this assignment's scope.

- **Repository Pattern**: Implemented repository interfaces to abstract database operations, making the code testable and maintainable.

- **Service Layer**: Business logic and validation are centralized in service classes, keeping controllers thin and focused on HTTP concerns.

### Frontend

- **Component Structure**: The application uses a modular component approach with clear separation:

- **Container Components** (`ShiftScheduler`, `StaffList`) manage state and business logic
- **Presentational Components** (`ShiftForm`, `AlertMessages`) focus on UI rendering
- **Custom Hooks** (`useAlertMessages`) extract reusable state logic from components

- **State Management**: Chose React's built-in `useState` and `useEffect` for simplicity, avoiding over-engineering with Redux/Context for this scope.

- **API Layer**: Centralized axios configuration with automatic base URL detection for mobile testing across network environments.

## Considerations & Trade-offs

### With More Time, I'd Add:

- Component testing (Jest/React Testing Library)
- Custom hooks for API logic (useStaffData, etc.)
- Client-side form validation (Formik or React Hook Form)
- React error boundaries
- JWT authentication and RBAC
- Redis caching, pagination, and indexing for performance
- WebSocket support for real-time updates

### Current Limitations & Design Decisions

- No auth system: CORS filters origins but does not secure endpoints.
- CORS config: Dynamically allows localhost and local network IPs for testing.
- Error handling: Basic 400-level responses. No centralized logging or monitoring.
- Data reset on rebuild: No persistent volume for MySQL by design.

### API Specification

```json
{
  "endpoints": {
    "GET /staff": {
      "description": "Retrieve all staff members",
      "response": "[{id, name, role, phone}]"
    },
    "POST /staff": {
      "description": "Create new staff member",
      "body": "{name: string, role: enum, phone: string}",
      "validation": "Role: Cook|Server|Manager, phone: xxx-xxx-xxxx"
    },
    "GET /shifts": {
      "description": "Retrieve all shifts",
      "response": "[{id, day, start_time, end_time, role_required}]"
    },
    "POST /shifts": {
      "description": "Create new shift",
      "body": "{day: date, start_time: time, end_time: time, role_required: string}"
    },
    "GET /assignments": {
      "description": "Retrieve staff-shift assignments with details",
      "response": "[{assignment_id, staff_id, staff_name, staff_role, shift_id, day, start_time, end_time, role_required}]"
    },
    "POST /assign": {
      "description": "Assign staff to shift",
      "body": "{staff_id: int, shift_id: int}",
      "validation": "Prevents duplicates, validates role matches"
    }
  }
}
```

## License

MIT License
