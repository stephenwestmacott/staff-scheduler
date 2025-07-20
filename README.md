# Staff Scheduler

A modern full-stack web application for managing staff schedules with role-based assignments.

## Quick Start

**Prerequisites:** Docker and Docker Compose must be **installed and running**.  
📥 Download Docker Desktop: https://www.docker.com/products/docker-desktop/

```bash
# Clone the repository
git clone https://github.com/stephenwestmacott/staff-scheduler

# Navigate to project directory
cd staff-scheduler

# Create environment file
cp .env.example .env

# Start all services
docker-compose up -d --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
```

**⚠️ Note:** MySQL takes 1-2 minutes to initialize. The app will connect automatically once ready.

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

```bash
# Run unit tests
cd backend
./vendor/bin/phpunit tests/
```

## API Endpoints

| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| GET    | `/api/staff`  | List all staff  |
| POST   | `/api/staff`  | Create staff    |
| GET    | `/api/shifts` | List shifts     |
| POST   | `/api/shifts` | Create shift    |
| POST   | `/api/assign` | Assign to shift |

## License

MIT License
