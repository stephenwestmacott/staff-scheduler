<?php

namespace App\Repositories;

use PDO;

class ShiftRepository implements ShiftRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Get all shifts
     *
     * @return array
     */
    public function findAll(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM shifts");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new shift
     *
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool
    {
        $stmt = $this->pdo->prepare("INSERT INTO shifts (day, start_time, end_time, role_required) VALUES (:day, :start_time, :end_time, :role_required)");
        return $stmt->execute([
            ':day' => $data['day'],
            ':start_time' => $data['start_time'],
            ':end_time' => $data['end_time'],
            ':role_required' => $data['role_required'],
        ]);
    }

    /**
     * Find a shift by ID
     *
     * @param int $id
     * @return array|null
     */
    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM shifts WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }
}
