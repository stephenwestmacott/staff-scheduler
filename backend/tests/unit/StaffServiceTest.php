<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../src/Services/StaffService.php';
require_once __DIR__ . '/../../src/StaffValidator.php';

class StaffServiceTest extends TestCase
{
    public function testCreateStaffMissingName()
    {
        // Create a mock repository
        $mockRepo = $this->getMockBuilder('App\Repositories\StaffRepositoryInterface')->getMock();
        $service = new App\Services\StaffService($mockRepo);

        $invalidData = [
            'role' => 'Server',
            'phone' => '306-555-1234'
            // Missing 'name'
        ];

        $result = $service->createStaff($invalidData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Missing required fields', $result['error']);
    }

    public function testCreateStaffInvalidRole()
    {
        $mockRepo = $this->getMockBuilder('App\Repositories\StaffRepositoryInterface')->getMock();
        $service = new App\Services\StaffService($mockRepo);

        $invalidData = [
            'name' => 'John Doe',
            'role' => 'InvalidRole',
            'phone' => '306-555-1234'
        ];

        $result = $service->createStaff($invalidData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Invalid role. Must be one of: Cook, Server, Manager', $result['error']);
    }

    public function testCreateStaffInvalidPhone()
    {
        $mockRepo = $this->getMockBuilder('App\Repositories\StaffRepositoryInterface')->getMock();
        $service = new App\Services\StaffService($mockRepo);

        $invalidData = [
            'name' => 'John Doe',
            'role' => 'Server',
            'phone' => '3065551234' // Invalid format
        ];

        $result = $service->createStaff($invalidData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Invalid phone format. Must be in format 306-555-1234', $result['error']);
    }
}
