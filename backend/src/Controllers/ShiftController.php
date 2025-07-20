<?php

namespace App\Controllers;

use App\Services\ShiftService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ShiftController
{
    private ShiftService $shiftService;

    public function __construct(ShiftService $shiftService)
    {
        $this->shiftService = $shiftService;
    }

    /**
     * GET /shifts - Retrieve all shifts
     */
    public function index(Request $request, Response $response): Response
    {
        $shifts = $this->shiftService->getAllShifts();

        $response->getBody()->write(json_encode($shifts));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * POST /shifts - Create a new shift
     */
    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $result = $this->shiftService->createShift($data);

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
