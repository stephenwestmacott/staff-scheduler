<?php

/**
 * Staff Scheduler API
 * 
 * RESTful API for managing staff, shifts, and assignments.
 * Built with Slim Framework 4.
 * 
 * @author Stephen Westmacott
 * @version 2.0
 */

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Container;
use App\Controllers\StaffController;
use App\Controllers\ShiftController;
use App\Controllers\AssignmentController;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/StaffValidator.php';

// Initialize dependency injection container
$container = new Container();
$container->registerServices();

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
//                          ROUTE DEFINITIONS 
// ============================================================================

// Staff routes
$app->get('/staff', function (Request $request, Response $response) use ($container) {
    $controller = $container->get(StaffController::class);
    return $controller->index($request, $response);
});

$app->post('/staff', function (Request $request, Response $response) use ($container) {
    $controller = $container->get(StaffController::class);
    return $controller->create($request, $response);
});

// Shift routes
$app->get('/shifts', function (Request $request, Response $response) use ($container) {
    $controller = $container->get(ShiftController::class);
    return $controller->index($request, $response);
});

$app->post('/shifts', function (Request $request, Response $response) use ($container) {
    $controller = $container->get(ShiftController::class);
    return $controller->create($request, $response);
});

// Assignment routes
$app->post('/assign', function (Request $request, Response $response) use ($container) {
    $controller = $container->get(AssignmentController::class);
    return $controller->assign($request, $response);
});

$app->get('/assignments', function (Request $request, Response $response) use ($container) {
    $controller = $container->get(AssignmentController::class);
    return $controller->index($request, $response);
});

$app->run();
