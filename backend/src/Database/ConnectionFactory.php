<?php

namespace App\Database;

use PDO;
use PDOException;

/**
 * Database Connection Factory
 * 
 * Creates PDO database connections with environment variable configuration.
 * 
 * @author Stephen Westmacott
 * @version 2.0
 */
class ConnectionFactory
{
    /**
     * Create a PDO database connection
     * 
     * @return PDO Configured database connection
     * @throws PDOException If connection fails
     */
    public static function create(): PDO
    {
        // Get database config from environment variables
        $host = $_ENV['DB_HOST'] ?? 'localhost';
        $db   = $_ENV['DB_NAME'] ?? 'staff_scheduler';
        $user = $_ENV['DB_USER'] ?? 'devuser';
        $pass = $_ENV['DB_PASS'] ?? 'devpass';

        // Build connection string
        $dsn  = "mysql:host=$host;dbname=$db;charset=utf8mb4";

        try {
            // Create PDO connection with error handling
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            return $pdo;
        } catch (PDOException $e) {
            // Exit on connection failure
            die("Database connection failed: " . $e->getMessage());
        }
    }
}
