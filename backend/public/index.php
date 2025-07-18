<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/ping', function ($request, $response) {
    $response->getBody()->write('ping');
    return $response;
});

$app->run();
