<?php

namespace App\Repositories;

interface StaffRepositoryInterface
{
    /**
     * Get all staff members
     *
     * @return array
     */
    public function findAll(): array;

    /**
     * Create a new staff member
     *
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool;

    /**
     * Find a staff member by ID
     *
     * @param int $id
     * @return array|null
     */
    public function findById(int $id): ?array;
}
