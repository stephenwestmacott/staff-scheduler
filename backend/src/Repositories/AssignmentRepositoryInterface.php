<?php

namespace App\Repositories;

interface AssignmentRepositoryInterface
{
    /**
     * Create a new assignment
     *
     * @param int $staffId
     * @param int $shiftId
     * @return bool
     */
    public function create(int $staffId, int $shiftId): bool;

    /**
     * Check if assignment already exists
     *
     * @param int $staffId
     * @param int $shiftId
     * @return bool
     */
    public function exists(int $staffId, int $shiftId): bool;

    /**
     * Get all assignments with detailed information
     *
     * @return array
     */
    public function findAllWithDetails(): array;
}
