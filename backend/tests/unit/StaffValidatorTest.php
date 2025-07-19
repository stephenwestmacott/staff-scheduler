<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../src/StaffValidator.php';


// Unit tests for StaffValidator
class StaffValidatorTest extends TestCase
{
    // Test phone number validation with valid formats
    public function testValidPhoneNumbers()
    {
        // Valid phone numbers
        $this->assertTrue(StaffValidator::validatePhoneNumber('306-555-1234'));
        $this->assertTrue(StaffValidator::validatePhoneNumber('123-456-7890'));
        $this->assertTrue(StaffValidator::validatePhoneNumber('999-888-7777'));
    }

    // Test phone number validation with invalid formats
    public function testInvalidPhoneNumbers()
    {
        // Invalid formats
        $this->assertFalse(StaffValidator::validatePhoneNumber('306-555-12345')); // Too many digits
        $this->assertFalse(StaffValidator::validatePhoneNumber('306-555-123'));   // Too few digits
        $this->assertFalse(StaffValidator::validatePhoneNumber('3065551234'));    // No dashes
        $this->assertFalse(StaffValidator::validatePhoneNumber('306.555.1234'));  // Wrong separator
        $this->assertFalse(StaffValidator::validatePhoneNumber('abc-def-ghij'));  // Letters
        $this->assertFalse(StaffValidator::validatePhoneNumber(''));              // Empty string
    }

    // Test role validation with valid roles
    public function testValidRoles()
    {
        $this->assertTrue(StaffValidator::validateRole('Cook'));
        $this->assertTrue(StaffValidator::validateRole('Server'));
        $this->assertTrue(StaffValidator::validateRole('Manager'));
    }

    // Test role validation with invalid roles
    public function testInvalidRoles()
    {
        $this->assertFalse(StaffValidator::validateRole('chef'));     // Wrong case
        $this->assertFalse(StaffValidator::validateRole('Waiter'));   // Not in list
        $this->assertFalse(StaffValidator::validateRole(''));         // Empty string
        $this->assertFalse(StaffValidator::validateRole('COOK'));     // Wrong case
        $this->assertFalse(StaffValidator::validateRole('Cashier'));  // Not in list
    }

    // Test getting valid roles list
    public function testGetValidRoles()
    {
        $roles = StaffValidator::getValidRoles();
        $this->assertIsArray($roles);
        $this->assertCount(3, $roles);
        $this->assertContains('Cook', $roles);
        $this->assertContains('Server', $roles);
        $this->assertContains('Manager', $roles);
    }
}
