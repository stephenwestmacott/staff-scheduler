<?php

namespace App\Controllers;

use App\Services\StaffService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class StaffController
{
    private StaffService $staffService;

    public function __construct(StaffService $staffService)
    {
        $this->staffService = $staffService;
    }

    /**
     * GET /staff - Retrieve all staff members
     */
    public function index(Request $request, Response $response): Response
    {
        $staff = $this->staffService->getAllStaff();

        $response->getBody()->write(json_encode($staff));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * POST /staff - Create a new staff member
     */
    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $result = $this->staffService->createStaff($data);

        if ($result['success']) {
            $response->getBody()->write(json_encode(['message' => $result['message']]));
            return $response->withHeader('Content-Type', 'application/json');
        } else {
            $response->getBody()->write(json_encode([
                'error' => $result['error'],
                'required' => $result['required'] ?? null
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }
}
