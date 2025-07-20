<?php

namespace App\Repositories;

use PDO;

class AssignmentRepository implements AssignmentRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Create a new assignment
     *
     * @param int $staffId
     * @param int $shiftId
     * @return bool
     */
    public function create(int $staffId, int $shiftId): bool
    {
        $stmt = $this->pdo->prepare("INSERT INTO staff_shifts (staff_id, shift_id) VALUES (:staff_id, :shift_id)");
        return $stmt->execute([
            ':staff_id' => $staffId,
            ':shift_id' => $shiftId,
        ]);
    }

    /**
     * Check if assignment already exists
     *
     * @param int $staffId
     * @param int $shiftId
     * @return bool
     */
    public function exists(int $staffId, int $shiftId): bool
    {
        $stmt = $this->pdo->prepare("SELECT 1 FROM staff_shifts WHERE staff_id = :staff_id AND shift_id = :shift_id");
        $stmt->execute([
            ':staff_id' => $staffId,
            ':shift_id' => $shiftId
        ]);
        return (bool) $stmt->fetch();
    }

    /**
     * Get all assignments with detailed information
     *
     * @return array
     */
    public function findAllWithDetails(): array
    {
        $stmt = $this->pdo->query("
            SELECT 
                sa.id AS assignment_id,
                s.id AS staff_id,
                s.name AS staff_name,
                s.role AS staff_role,
                sh.id AS shift_id,
                sh.day,
                sh.start_time,
                sh.end_time,
                sh.role_required
            FROM staff_shifts sa
            JOIN staff s ON sa.staff_id = s.id
            JOIN shifts sh ON sa.shift_id = sh.id
            ORDER BY sh.day, sh.start_time
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
