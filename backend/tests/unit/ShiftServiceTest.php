<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../src/Services/ShiftService.php';

class ShiftServiceTest extends TestCase
{
    public function testCreateShiftMissingDay()
    {
        $mockRepo = $this->getMockBuilder('App\Repositories\ShiftRepositoryInterface')->getMock();
        $service = new App\Services\ShiftService($mockRepo);

        $invalidData = [
            'start_time' => '09:00',
            'end_time' => '17:00',
            'role_required' => 'Server'
            // Missing 'day'
        ];

        $result = $service->createShift($invalidData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Missing required fields', $result['error']);
    }

    public function testCreateShiftInvalidRole()
    {
        $mockRepo = $this->getMockBuilder('App\Repositories\ShiftRepositoryInterface')->getMock();
        $service = new App\Services\ShiftService($mockRepo);

        $invalidData = [
            'day' => 'Monday',
            'start_time' => '09:00',
            'end_time' => '17:00',
            'role_required' => 'InvalidRole'
        ];

        // Mock the repository to return false to simulate creation failure
        $mockRepo->method('create')->willReturn(false);

        $result = $service->createShift($invalidData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Failed to create shift', $result['error']);
    }

    public function testCreateShiftMissingStartTime()
    {
        $mockRepo = $this->getMockBuilder('App\Repositories\ShiftRepositoryInterface')->getMock();
        $service = new App\Services\ShiftService($mockRepo);

        $invalidData = [
            'day' => 'Monday',
            'end_time' => '17:00',
            'role_required' => 'Server'
            // Missing 'start_time'
        ];

        $result = $service->createShift($invalidData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Missing required fields', $result['error']);
    }
}
