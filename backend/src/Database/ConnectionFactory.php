<?php

namespace App\Database;

use PDO;
use PDOException;

/**
 * Database Connection Factory
 * 
 * Provides database connection functionality for the Staff Scheduler application.
 * Uses PDO for secure database operations with proper error handling and configuration.
 * Supports environment variable configuration for different deployment environments.
 * 
 * @author Stephen Westmacott
 * @version 2.0
 */
class ConnectionFactory
{
    /**
     * Creates and returns a PDO database connection
     * 
     * Creates a MySQL database connection using PDO with proper configuration for
     * error handling, character encoding, and security. Uses environment variables
     * for configuration with sensible defaults for development.
     * 
     * Environment Variables:
     * - DB_HOST: Database host (default: localhost)
     * - DB_NAME: Database name (default: staff_scheduler)  
     * - DB_USER: Database username (default: devuser)
     * - DB_PASS: Database password (default: devpass)
     * 
     * @return PDO Configured PDO database connection instance
     * @throws PDOException If database connection fails
     */
    public static function create(): PDO
    {
        // Database configuration with environment variable fallbacks
        $host = $_ENV['DB_HOST'] ?? 'localhost';
        $db   = $_ENV['DB_NAME'] ?? 'staff_scheduler';
        $user = $_ENV['DB_USER'] ?? 'devuser';
        $pass = $_ENV['DB_PASS'] ?? 'devpass';

        // Build DSN (Data Source Name) with UTF-8 character set
        $dsn  = "mysql:host=$host;dbname=$db;charset=utf8mb4";

        try {
            // Create PDO connection with exception mode enabled for error handling
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            return $pdo;
        } catch (PDOException $e) {
            // Terminate execution with error message if connection fails
            die("Database connection failed: " . $e->getMessage());
        }
    }
}
