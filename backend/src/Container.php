<?php

namespace App;

use App\Controllers\StaffController;
use App\Controllers\ShiftController;
use App\Controllers\AssignmentController;
use App\Services\StaffService;
use App\Services\ShiftService;
use App\Services\AssignmentService;
use App\Repositories\StaffRepository;
use App\Repositories\ShiftRepository;
use App\Repositories\AssignmentRepository;
use App\Repositories\StaffRepositoryInterface;
use App\Repositories\ShiftRepositoryInterface;
use App\Repositories\AssignmentRepositoryInterface;
use App\Database\ConnectionFactory;
use PDO;

class Container
{
    private array $bindings = [];
    private array $instances = [];

    public function bind(string $abstract, callable $concrete): void
    {
        $this->bindings[$abstract] = $concrete;
    }

    public function singleton(string $abstract, callable $concrete): void
    {
        $this->bind($abstract, function () use ($concrete, $abstract) {
            if (!isset($this->instances[$abstract])) {
                $this->instances[$abstract] = $concrete();
            }
            return $this->instances[$abstract];
        });
    }

    public function get(string $abstract)
    {
        if (!isset($this->bindings[$abstract])) {
            throw new \Exception("No binding found for {$abstract}");
        }

        return $this->bindings[$abstract]();
    }

    public function registerServices(): void
    {
        // Register PDO connection as singleton
        $this->singleton(PDO::class, function () {
            return ConnectionFactory::create();
        });

        // Register repository interfaces
        $this->bind(StaffRepositoryInterface::class, function () {
            return new StaffRepository($this->get(PDO::class));
        });

        $this->bind(ShiftRepositoryInterface::class, function () {
            return new ShiftRepository($this->get(PDO::class));
        });

        $this->bind(AssignmentRepositoryInterface::class, function () {
            return new AssignmentRepository($this->get(PDO::class));
        });

        // Register services
        $this->bind(StaffService::class, function () {
            return new StaffService($this->get(StaffRepositoryInterface::class));
        });

        $this->bind(ShiftService::class, function () {
            return new ShiftService($this->get(ShiftRepositoryInterface::class));
        });

        $this->bind(AssignmentService::class, function () {
            return new AssignmentService(
                $this->get(AssignmentRepositoryInterface::class),
                $this->get(StaffRepositoryInterface::class),
                $this->get(ShiftRepositoryInterface::class)
            );
        });

        // Register controllers
        $this->bind(StaffController::class, function () {
            return new StaffController($this->get(StaffService::class));
        });

        $this->bind(ShiftController::class, function () {
            return new ShiftController($this->get(ShiftService::class));
        });

        $this->bind(AssignmentController::class, function () {
            return new AssignmentController($this->get(AssignmentService::class));
        });
    }
}
