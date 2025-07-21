<?php

namespace App\Services;

use App\Repositories\ShiftRepositoryInterface;

class ShiftService
{
    private ShiftRepositoryInterface $shiftRepository;

    public function __construct(ShiftRepositoryInterface $shiftRepository)
    {
        $this->shiftRepository = $shiftRepository;
    }

    /**
     * Get all shifts
     *
     * @return array
     */
    public function getAllShifts(): array
    {
        return $this->shiftRepository->findAll();
    }

    /**
     * Create a new shift with validation
     *
     * @param array $data
     * @return array Success or error response
     */
    public function createShift(array $data): array
    {
        // Validate required fields
        $requiredFields = ['day', 'start_time', 'end_time', 'role_required'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return [
                    'success' => false,
                    'error' => 'Missing required fields',
                    'required' => $requiredFields
                ];
            }
        }

        // Additional validation could be added here:
        // - Date format validation
        // - Time format validation
        // - Logical time validation (end_time > start_time)
        // - Role validation against allowed roles

        // Create the shift
        $success = $this->shiftRepository->create($data);

        if ($success) {
            return [
                'success' => true,
                'message' => 'Shift created successfully'
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Failed to create shift'
            ];
        }
    }
}
