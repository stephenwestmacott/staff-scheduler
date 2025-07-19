<?php

/**
 * Staff validation utilities
 */
class StaffValidator
{
    // Valid roles for staff members
    const VALID_ROLES = ['Cook', 'Server', 'Manager'];

    // Validates phone number format (xxx-xxx-xxxx)
    public static function validatePhoneNumber($phone)
    {
        return preg_match('/^\d{3}-\d{3}-\d{4}$/', $phone) === 1;
    }


    // Validates if role is one of the allowed roles
    public static function validateRole($role)
    {
        return in_array($role, self::VALID_ROLES);
    }

    /**
     * Get list of valid roles
     * @return array Array of valid role strings
     */
    public static function getValidRoles()
    {
        return self::VALID_ROLES;
    }
}
