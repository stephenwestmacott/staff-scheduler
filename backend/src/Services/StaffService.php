<?php

namespace App\Services;

use App\Repositories\StaffRepositoryInterface;

class StaffService
{
    private StaffRepositoryInterface $staffRepository;

    public function __construct(StaffRepositoryInterface $staffRepository)
    {
        $this->staffRepository = $staffRepository;
    }

    /**
     * Get all staff members
     *
     * @return array
     */
    public function getAllStaff(): array
    {
        return $this->staffRepository->findAll();
    }

    /**
     * Create a new staff member with validation
     *
     * @param array $data
     * @return array Success or error response
     */
    public function createStaff(array $data): array
    {
        // Validate required fields
        $requiredFields = ['name', 'role', 'phone'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return [
                    'success' => false,
                    'error' => 'Missing required fields',
                    'required' => $requiredFields
                ];
            }
        }

        // Validate role using StaffValidator class
        if (!\StaffValidator::validateRole($data['role'])) {
            return [
                'success' => false,
                'error' => 'Invalid role. Must be one of: ' . implode(', ', \StaffValidator::getValidRoles())
            ];
        }

        // Validate phone format using StaffValidator class
        if (!\StaffValidator::validatePhoneNumber($data['phone'])) {
            return [
                'success' => false,
                'error' => 'Invalid phone format. Must be in format 306-555-1234'
            ];
        }

        // Create the staff member
        $success = $this->staffRepository->create($data);

        if ($success) {
            return [
                'success' => true,
                'message' => 'Staff member created successfully'
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Failed to create staff member'
            ];
        }
    }
}
