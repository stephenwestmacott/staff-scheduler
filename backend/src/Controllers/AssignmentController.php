<?php

namespace App\Controllers;

use App\Services\AssignmentService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AssignmentController
{
    private AssignmentService $assignmentService;

    public function __construct(AssignmentService $assignmentService)
    {
        $this->assignmentService = $assignmentService;
    }

    /**
     * POST /assign - Assign a staff member to a shift
     */
    public function assign(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $result = $this->assignmentService->assignStaffToShift($data);

        if ($result['success']) {
            $response->getBody()->write(json_encode(['message' => $result['message']]));
            return $response->withHeader('Content-Type', 'application/json');
        } else {
            $statusCode = 400;
            if (isset($result['error']) && strpos($result['error'], 'already assigned') !== false) {
                $statusCode = 409; // Conflict
            } elseif (isset($result['error']) && strpos($result['error'], 'Invalid staff or shift ID') !== false) {
                $statusCode = 404; // Not Found
            }

            $errorResponse = ['error' => $result['error']];
            if (isset($result['staff_role'], $result['required_role'])) {
                $errorResponse['staff_role'] = $result['staff_role'];
                $errorResponse['required_role'] = $result['required_role'];
            }
            if (isset($result['required'])) {
                $errorResponse['required'] = $result['required'];
            }

            $response->getBody()->write(json_encode($errorResponse));
            return $response->withStatus($statusCode)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * GET /assignments - Retrieve all current staff assignments
     */
    public function index(Request $request, Response $response): Response
    {
        $assignments = $this->assignmentService->getAllAssignments();

        $response->getBody()->write(json_encode($assignments));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
