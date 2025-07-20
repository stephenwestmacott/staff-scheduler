<?php

namespace App\Repositories;

interface ShiftRepositoryInterface
{
    /**
     * Get all shifts
     *
     * @return array
     */
    public function findAll(): array;

    /**
     * Create a new shift
     *
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool;

    /**
     * Find a shift by ID
     *
     * @param int $id
     * @return array|null
     */
    public function findById(int $id): ?array;
}
