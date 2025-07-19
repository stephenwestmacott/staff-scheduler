<?php

/**
 * Staff Scheduler API
 * 
 * A RESTful API for managing staff members, shifts, and assignments.
 * Built with Slim Framework 4 and includes comprehensive validation.
 * 
 * @author Stephen Westmacott
 * @version 1.0
 */

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/DbConn.php';
require __DIR__ . '/../src/StaffValidator.php';

$app = AppFactory::create();

// CORS Middleware - Allow cross-origin requests from React frontend
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    // Allow localhost and local network access for mobile testing
    $allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ];

    // Get the client's origin
    $origin = $request->getHeaderLine('Origin');

    // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    if (preg_match('/^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+):5173$/', $origin)) {
        $allowedOrigins[] = $origin;
    }

    $corsOrigin = in_array($origin, $allowedOrigins) ? $origin : 'http://localhost:5173';

    return $response
        ->withHeader('Access-Control-Allow-Origin', $corsOrigin)
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

// Middleware to parse JSON request bodies
$app->addBodyParsingMiddleware();

// Handle preflight OPTIONS requests for CORS compliance
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

// ============================================================================
// STAFF ENDPOINTS
// ============================================================================

/**
 * GET /staff - Retrieve all staff members
 * 
 * @return array List of all staff members with id, name, role, phone
 */
$app->get('/staff', function (Request $request, Response $response) {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM staff");
    $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response->getBody()->write(json_encode($staff));
    return $response->withHeader('Content-Type', 'application/json');
});

/**
 * POST /staff - Create a new staff member
 * 
 * Required fields: name, role, phone
 * Validates role against allowed values and phone format (xxx-xxx-xxxx)
 * 
 * @param string $name Staff member's full name
 * @param string $role Must be Cook, Server, or Manager
 * @param string $phone Phone number in format xxx-xxx-xxxx
 * @return object Success message or validation errors
 */
$app->post('/staff', function (Request $request, Response $response) {
    $pdo = getConnection();
    $data = $request->getParsedBody();

    // Validate required fields
    if (!isset($data['name'], $data['role'], $data['phone'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Missing required fields',
            'required' => ['name', 'role', 'phone']
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Validate role using StaffValidator class
    if (!StaffValidator::validateRole($data['role'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Invalid role. Must be one of: ' . implode(', ', StaffValidator::getValidRoles())
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Validate phone format using StaffValidator class
    if (!StaffValidator::validatePhoneNumber($data['phone'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Invalid phone format. Must be in format 306-555-1234'
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Insert new staff member into database
    $stmt = $pdo->prepare("INSERT INTO staff (name, role, phone) VALUES (:name, :role, :phone)");
    $stmt->execute([
        ':name' => $data['name'],
        ':role' => $data['role'],
        ':phone' => $data['phone'],
    ]);

    $response->getBody()->write(json_encode(['message' => 'Staff member created successfully']));
    return $response->withHeader('Content-Type', 'application/json');
});

// ============================================================================
// SHIFT ENDPOINTS  
// ============================================================================

/**
 * GET /shifts - Retrieve all shifts
 * 
 * @return array List of all shifts with id, day, start_time, end_time, role_required
 */
$app->get('/shifts', function (Request $request, Response $response) {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM shifts");
    $shifts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response->getBody()->write(json_encode($shifts));
    return $response->withHeader('Content-Type', 'application/json');
});

/**
 * POST /shifts - Create a new shift
 * 
 * Required fields: day (YYYY-MM-DD), start_time, end_time, role_required
 * 
 * @param string $day Date in YYYY-MM-DD format
 * @param string $start_time Time in HH:MM format
 * @param string $end_time Time in HH:MM format  
 * @param string $role_required Role needed for this shift (cook, server, manager)
 * @return object Success message or validation errors
 */

$app->post('/shifts', function (Request $request, Response $response) {
    $pdo = getConnection();
    $data = $request->getParsedBody();

    // Validate required fields
    if (!isset($data['day'], $data['start_time'], $data['end_time'], $data['role_required'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Missing required fields',
            'required' => ['day', 'start_time', 'end_time', 'role_required']
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Insert new shift into database
    $stmt = $pdo->prepare("INSERT INTO shifts (day, start_time, end_time, role_required) VALUES (:day, :start_time, :end_time, :role_required)");
    $stmt->execute([
        ':day' => $data['day'],
        ':start_time' => $data['start_time'],
        ':end_time' => $data['end_time'],
        ':role_required' => $data['role_required'],
    ]);

    $response->getBody()->write(json_encode(['message' => 'Shift created successfully']));
    return $response->withHeader('Content-Type', 'application/json');
});

// ============================================================================
// ASSIGNMENT ENDPOINTS
// ============================================================================

/**
 * POST /assign - Assign a staff member to a shift
 * 
 * Validates that staff member's role matches the required role for the shift.
 * Prevents duplicate assignments.
 * 
 * @param int $staff_id ID of the staff member to assign
 * @param int $shift_id ID of the shift to assign to
 * @return object Success message or validation errors
 */

$app->post('/assign', function (Request $request, Response $response) {
    $pdo = getConnection();
    $data = $request->getParsedBody();

    // Validate required fields
    if (!isset($data['staff_id'], $data['shift_id'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Missing required fields',
            'required' => ['staff_id', 'shift_id']
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Check for existing assignment to prevent duplicates
    $checkStmt = $pdo->prepare("SELECT 1 FROM staff_shifts WHERE staff_id = :staff_id AND shift_id = :shift_id");
    $checkStmt->execute([
        ':staff_id' => $data['staff_id'],
        ':shift_id' => $data['shift_id']
    ]);

    if ($checkStmt->fetch()) {
        $response->getBody()->write(json_encode([
            'error' => 'Staff member is already assigned to this shift.'
        ]));
        return $response->withStatus(409)->withHeader('Content-Type', 'application/json');
    }

    // Fetch staff member's role
    $staffStmt = $pdo->prepare("SELECT role FROM staff WHERE id = :staff_id");
    $staffStmt->execute([':staff_id' => $data['staff_id']]);
    $staff = $staffStmt->fetch(PDO::FETCH_ASSOC);

    // Fetch shift's required role
    $shiftStmt = $pdo->prepare("SELECT role_required FROM shifts WHERE id = :shift_id");
    $shiftStmt->execute([':shift_id' => $data['shift_id']]);
    $shift = $shiftStmt->fetch(PDO::FETCH_ASSOC);

    // Validate that both staff member and shift exist
    if (!$staff || !$shift) {
        $response->getBody()->write(json_encode([
            'error' => 'Invalid staff or shift ID'
        ]));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }

    // Validate role matching - staff role must match shift requirement
    if ($staff['role'] !== $shift['role_required']) {
        $response->getBody()->write(json_encode([
            'error' => 'Staff role does not match the required role for this shift',
            'staff_role' => $staff['role'],
            'required_role' => $shift['role_required']
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Create the assignment
    $stmt = $pdo->prepare("INSERT INTO staff_shifts (staff_id, shift_id) VALUES (:staff_id, :shift_id)");
    $stmt->execute([
        ':staff_id' => $data['staff_id'],
        ':shift_id' => $data['shift_id'],
    ]);

    $response->getBody()->write(json_encode(['message' => 'Shift assigned to staff member successfully']));
    return $response->withHeader('Content-Type', 'application/json');
});

/**
 * GET /assignments - Retrieve all current staff assignments
 * 
 * Returns detailed information about which staff members are assigned to which shifts,
 * including staff details and shift information.
 * 
 * @return array List of assignments with staff and shift details
 */


$app->get('/assignments', function (Request $request, Response $response) {
    $pdo = getConnection();

    $stmt = $pdo->query("
        SELECT 
            sa.id AS assignment_id,
            s.id AS staff_id,
            s.name AS staff_name,
            s.role AS staff_role,
            sh.id AS shift_id,
            sh.day,
            sh.start_time,
            sh.end_time,
            sh.role_required
        FROM staff_shifts sa
        JOIN staff s ON sa.staff_id = s.id
        JOIN shifts sh ON sa.shift_id = sh.id
        ORDER BY sh.day, sh.start_time
    ");

    $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response->getBody()->write(json_encode($assignments));
    return $response->withHeader('Content-Type', 'application/json');
});


$app->run();
