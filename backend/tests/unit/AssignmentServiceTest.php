<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../src/Services/AssignmentService.php';

class AssignmentServiceTest extends TestCase
{
    public function testAssignStaffMissingStaffId()
    {
        $mockAssignmentRepo = $this->getMockBuilder('App\Repositories\AssignmentRepositoryInterface')->getMock();
        $mockStaffRepo = $this->getMockBuilder('App\Repositories\StaffRepositoryInterface')->getMock();
        $mockShiftRepo = $this->getMockBuilder('App\Repositories\ShiftRepositoryInterface')->getMock();

        $service = new App\Services\AssignmentService($mockAssignmentRepo, $mockStaffRepo, $mockShiftRepo);

        $invalidData = [
            'shift_id' => 1
            // Missing 'staff_id'
        ];

        $result = $service->assignStaffToShift($invalidData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Missing required fields', $result['error']);
    }

    public function testAssignStaffMissingShiftId()
    {
        $mockAssignmentRepo = $this->getMockBuilder('App\Repositories\AssignmentRepositoryInterface')->getMock();
        $mockStaffRepo = $this->getMockBuilder('App\Repositories\StaffRepositoryInterface')->getMock();
        $mockShiftRepo = $this->getMockBuilder('App\Repositories\ShiftRepositoryInterface')->getMock();

        $service = new App\Services\AssignmentService($mockAssignmentRepo, $mockStaffRepo, $mockShiftRepo);

        $invalidData = [
            'staff_id' => 1
            // Missing 'shift_id'
        ];

        $result = $service->assignStaffToShift($invalidData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Missing required fields', $result['error']);
    }

    public function testAssignStaffStaffNotFound()
    {
        $mockAssignmentRepo = $this->getMockBuilder('App\Repositories\AssignmentRepositoryInterface')->getMock();
        $mockStaffRepo = $this->getMockBuilder('App\Repositories\StaffRepositoryInterface')->getMock();
        $mockShiftRepo = $this->getMockBuilder('App\Repositories\ShiftRepositoryInterface')->getMock();

        // Mock assignment doesn't exist
        $mockAssignmentRepo->method('exists')->willReturn(false);
        // Mock staff not found
        $mockStaffRepo->method('findById')->willReturn(null);

        $service = new App\Services\AssignmentService($mockAssignmentRepo, $mockStaffRepo, $mockShiftRepo);

        $data = [
            'staff_id' => 999,
            'shift_id' => 1
        ];

        $result = $service->assignStaffToShift($data);

        $this->assertFalse($result['success']);
        $this->assertEquals('Invalid staff or shift ID', $result['error']);
    }
}
