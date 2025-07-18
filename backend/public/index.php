<?php

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/db-conn.php';

$app = AppFactory::create();

// Middleware to parse JSON body
$app->addBodyParsingMiddleware();

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


$app->run();
