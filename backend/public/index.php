<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/db-conn.php';

$app = AppFactory::create();

$app->get('/staff-test', function ($request, $response) {
    $pdo = getConnection(); // from db-conn.php
    $stmt = $pdo->query("SELECT * FROM staff");
    $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response->getBody()->write(json_encode($staff));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/ping', function ($request, $response) {
    $response->getBody()->write('ping');
    return $response;
});

$app->run();
