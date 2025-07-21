<?php

namespace App\Services;

use App\Repositories\AssignmentRepositoryInterface;
use App\Repositories\StaffRepositoryInterface;
use App\Repositories\ShiftRepositoryInterface;

class AssignmentService
{
    private AssignmentRepositoryInterface $assignmentRepository;
    private StaffRepositoryInterface $staffRepository;
    private ShiftRepositoryInterface $shiftRepository;

    public function __construct(
        AssignmentRepositoryInterface $assignmentRepository,
        StaffRepositoryInterface $staffRepository,
        ShiftRepositoryInterface $shiftRepository
    ) {
        $this->assignmentRepository = $assignmentRepository;
        $this->staffRepository = $staffRepository;
        $this->shiftRepository = $shiftRepository;
    }

    /**
     * Assign a staff member to a shift with comprehensive validation
     *
     * @param array $data
     * @return array Success or error response
     */
    public function assignStaffToShift(array $data): array
    {
        // Validate required fields
        if (!isset($data['staff_id'], $data['shift_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required fields',
                'required' => ['staff_id', 'shift_id']
            ];
        }

        $staffId = (int) $data['staff_id'];
        $shiftId = (int) $data['shift_id'];

        // Check for existing assignment to prevent duplicates
        if ($this->assignmentRepository->exists($staffId, $shiftId)) {
            return [
                'success' => false,
                'error' => 'Staff member is already assigned to this shift'
            ];
        }

        // Fetch staff member and shift
        $staff = $this->staffRepository->findById($staffId);
        $shift = $this->shiftRepository->findById($shiftId);

        // Validate that both staff member and shift exist
        if (!$staff || !$shift) {
            return [
                'success' => false,
                'error' => 'Invalid staff or shift ID'
            ];
        }

        // Validate role matching - staff role must match shift requirement
        if ($staff['role'] !== $shift['role_required']) {
            return [
                'success' => false,
                'error' => 'Staff role does not match the required role for this shift',
                'staff_role' => $staff['role'],
                'required_role' => $shift['role_required']
            ];
        }

        // Create the assignment
        $success = $this->assignmentRepository->create($staffId, $shiftId);

        if ($success) {
            return [
                'success' => true,
                'message' => 'Shift assigned to staff member successfully'
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Failed to create assignment'
            ];
        }
    }

    /**
     * Get all assignments with detailed information
     *
     * @return array
     */
    public function getAllAssignments(): array
    {
        return $this->assignmentRepository->findAllWithDetails();
    }
}
