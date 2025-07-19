<?php

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/db-conn.php';

$app = AppFactory::create();

// CORS Middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

// Middleware to parse JSON body
$app->addBodyParsingMiddleware();

// Handle preflight OPTIONS requests for CORS
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

// Endpoints
$app->get('/staff', function (Request $request, Response $response) {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM staff");
    $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response->getBody()->write(json_encode($staff));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/staff', function (Request $request, Response $response) {
    $pdo = getConnection();
    $data = $request->getParsedBody();

    if (!isset($data['name'], $data['role'], $data['phone'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Missing required fields',
            'required' => ['name', 'role', 'phone']
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Validate role
    $validRoles = ['Cook', 'Server', 'Manager'];
    if (!in_array($data['role'], $validRoles)) {
        $response->getBody()->write(json_encode([
            'error' => 'Invalid role. Must be one of: ' . implode(', ', $validRoles)
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Validate phone format (306-555-1234)
    if (!preg_match('/^\d{3}-\d{3}-\d{4}$/', $data['phone'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Invalid phone format. Must be in format 306-555-1234'
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    $stmt = $pdo->prepare("INSERT INTO staff (name, role, phone) VALUES (:name, :role, :phone)");
    $stmt->execute([
        ':name' => $data['name'],
        ':role' => $data['role'],
        ':phone' => $data['phone'],
    ]);

    $response->getBody()->write(json_encode(['message' => 'Staff member created successfully']));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/shifts', function (Request $request, Response $response) {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM shifts");
    $shifts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response->getBody()->write(json_encode($shifts));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/shifts', function (Request $request, Response $response) {
    $pdo = getConnection();
    $data = $request->getParsedBody();

    if (!isset($data['day'], $data['start_time'], $data['end_time'], $data['role_required'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Missing required fields',
            'required' => ['day', 'start_time', 'end_time', 'role_required']
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

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

$app->post('/assign', function (Request $request, Response $response) {
    $pdo = getConnection();
    $data = $request->getParsedBody();

    if (!isset($data['staff_id'], $data['shift_id'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Missing required fields',
            'required' => ['staff_id', 'shift_id']
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Check for existing assignment
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


    // Fetch staff role
    $staffStmt = $pdo->prepare("SELECT role FROM staff WHERE id = :staff_id");
    $staffStmt->execute([':staff_id' => $data['staff_id']]);
    $staff = $staffStmt->fetch(PDO::FETCH_ASSOC);

    // Fetch shift required role
    $shiftStmt = $pdo->prepare("SELECT role_required FROM shifts WHERE id = :shift_id");
    $shiftStmt->execute([':shift_id' => $data['shift_id']]);
    $shift = $shiftStmt->fetch(PDO::FETCH_ASSOC);

    // Check existence of both records
    if (!$staff || !$shift) {
        $response->getBody()->write(json_encode([
            'error' => 'Invalid staff or shift ID'
        ]));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }

    // Role validation
    if ($staff['role'] !== $shift['role_required']) {
        $response->getBody()->write(json_encode([
            'error' => 'Staff role does not match the required role for this shift',
            'staff_role' => $staff['role'],
            'required_role' => $shift['role_required']
        ]));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    // Insert assignment
    $stmt = $pdo->prepare("INSERT INTO staff_shifts (staff_id, shift_id) VALUES (:staff_id, :shift_id)");
    $stmt->execute([
        ':staff_id' => $data['staff_id'],
        ':shift_id' => $data['shift_id'],
    ]);

    $response->getBody()->write(json_encode(['message' => 'Shift assigned to staff member successfully']));
    return $response->withHeader('Content-Type', 'application/json');
});


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
