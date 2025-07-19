<?php

/**
 * StaffValidator Class
 * 
 * Provides validation utilities for staff-related data including phone numbers
 * and role validation. Used by the API endpoints to ensure data integrity.
 * 
 * @author Stephen Westmacott
 * @version 1.0
 */
class StaffValidator
{
    /**
     * Valid roles for staff members
     * These are the only accepted role values in the system
     */
    const VALID_ROLES = ['Cook', 'Server', 'Manager'];

    /**
     * Validates phone number format
     * 
     * Ensures phone number follows the pattern xxx-xxx-xxxx where x is a digit
     * Example: 306-555-1234
     * 
     * @param string $phone The phone number to validate
     * @return bool True if format is valid, false otherwise
     */
    public static function validatePhoneNumber($phone)
    {
        return preg_match('/^\d{3}-\d{3}-\d{4}$/', $phone) === 1;
    }

    /**
     * Validates if a role is allowed in the system
     * 
     * Checks if the provided role matches one of the predefined valid roles.
     * Case-sensitive comparison.
     * 
     * @param string $role The role to validate
     * @return bool True if role is valid, false otherwise
     */
    public static function validateRole($role)
    {
        return in_array($role, self::VALID_ROLES);
    }

    /**
     * Get list of all valid roles
     * 
     * Returns an array of all acceptable role values for use in validation
     * and form option generation.
     * 
     * @return array Array of valid role strings
     */
    public static function getValidRoles()
    {
        return self::VALID_ROLES;
    }
}
