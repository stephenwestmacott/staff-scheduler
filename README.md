# Staff Scheduler Application

A full-stack web application for managing staff members, shifts, and assignments with role-based validation.

## Features

- **Staff Management**: Add, view, and manage staff members with role validation
- **Shift Scheduling**: Create shifts with specific day, time, and role requirements
- **Staff Assignment**: Assign staff members to shifts with automatic role matching
- **Data Validation**: Comprehensive validation for phone numbers, roles, and assignments
- **Responsive UI**: Modern Material-UI interface with tabbed navigation

## Technology Stack

### Backend

- **PHP 8.2** with Slim Framework 4
- **MySQL 8.0** database
- **PDO** for database operations
- **PHPUnit** for testing
- **Docker** for containerization

### Frontend

- **React 19** with Vite
- **Material-UI (MUI)** components
- **Axios** for HTTP requests
- **Grid v2** responsive layout

## Project Structure

```
staff-scheduler/
├── backend/
│   ├── public/
│   │   └── index.php          # Main API endpoints
│   ├── src/
│   │   ├── DbConn.php         # Database connection
│   │   └── StaffValidator.php # Validation utilities
│   ├── tests/
│   │   └── unit/
│   │       └── StaffValidatorTest.php # Unit tests
│   ├── composer.json          # PHP dependencies
│   └── dockerfile             # Backend container
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StaffList.jsx      # Staff management
│   │   │   └── ShiftScheduler.jsx # Shift scheduling
│   │   ├── api/
│   │   │   └── axios.js           # HTTP client config
│   │   └── App.jsx                # Main application
│   ├── package.json           # Node dependencies
│   └── dockerfile             # Frontend container
├── db/
│   └── init.sql              # Database schema
└── docker-compose.yml        # Multi-service orchestration
```

## API Endpoints

### Staff Management

- `GET /staff` - Retrieve all staff members
- `POST /staff` - Create new staff member

### Shift Management

- `GET /shifts` - Retrieve all shifts
- `POST /shifts` - Create new shift

### Assignment Management

- `POST /assign` - Assign staff to shift
- `GET /assignments` - Retrieve all assignments

## Validation Rules

### Phone Numbers

- Format: `xxx-xxx-xxxx` (e.g., 306-555-1234)
- Automatic formatting in frontend forms

### Roles

- Valid roles: Cook, Server, Manager
- Case-sensitive validation
- Role matching required for assignments

### Shifts

- Day format: YYYY-MM-DD
- Time format: HH:MM
- Automatic conversion from day names to dates

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- PHP 8.2+ (for local development)

### Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>
cd staff-scheduler

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
```

**⚠️ Important:** The MySQL database container takes 1-2 minutes to fully initialize on first startup. During this time, the frontend may show "Failed to load data" errors. This is normal - the application will automatically connect once the database is ready.

You can monitor the database startup progress with:

```bash
docker-compose logs -f db
```

### Mobile Device Testing

The application includes automatic network detection for testing on mobile devices:

```bash
# 1. Start the services with Docker
docker-compose up -d

# 2. Find your computer's IP address
ipconfig | findstr "IPv4"  # Windows
# or
ifconfig | grep "inet "    # macOS/Linux

# 3. Access from mobile device (same Wi-Fi network)
# Frontend: http://YOUR_IP_ADDRESS:5173
# Example: http://192.168.0.105:5173
```

The frontend automatically detects when accessed via IP address and adjusts the API endpoints accordingly. No manual configuration needed!

### Local Development Setup

#### Backend

```bash
cd backend
composer install
php -S localhost:8000 -t public
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Database

```bash
# Import schema
mysql -u devuser -p staff_scheduler < db/init.sql
```

## Testing

### Unit Tests

```bash
cd backend
./vendor/bin/phpunit tests/unit/StaffValidatorTest.php
```

### Test Coverage

- Phone number validation (5 test cases)
- Role validation (3 test cases)
- Edge cases and error handling

## Code Quality Features

- **Comprehensive documentation** with PHPDoc comments
- **Modular architecture** with separation of concerns
- **Input validation** and sanitization
- **Error handling** with user-friendly messages
- **Responsive design** with mobile support
- **Type safety** with PHP type hints
- **Code organization** with clear structure

## Environment Variables

### Backend (.env)

```
DB_HOST=localhost
DB_NAME=staff_scheduler
DB_USER=devuser
DB_PASS=devpass
```

### Frontend

```
VITE_API_BASE_URL=http://localhost:8000
```

## Contributing

1. Follow PSR-12 coding standards for PHP
2. Use ESLint and Prettier for JavaScript
3. Write unit tests for new features
4. Document all public methods and classes
5. Ensure responsive design compatibility

## License

This project is licensed under the MIT License.
