<?php

namespace App\Repositories;

use PDO;

class StaffRepository implements StaffRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Get all staff members
     *
     * @return array
     */
    public function findAll(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM staff");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new staff member
     *
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool
    {
        $stmt = $this->pdo->prepare("INSERT INTO staff (name, role, phone) VALUES (:name, :role, :phone)");
        return $stmt->execute([
            ':name' => $data['name'],
            ':role' => $data['role'],
            ':phone' => $data['phone'],
        ]);
    }

    /**
     * Find a staff member by ID
     *
     * @param int $id
     * @return array|null
     */
    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM staff WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }
}
