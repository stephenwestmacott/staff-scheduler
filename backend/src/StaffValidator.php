<?php

/**
 * Staff data validation utilities
 * 
 * @author Stephen Westmacott
 * @version 1.0
 */
class StaffValidator
{
    /**
     * Valid staff roles
     */
    const VALID_ROLES = ['Cook', 'Server', 'Manager'];

    /**
     * Validate phone number format (xxx-xxx-xxxx)
     * 
     * @param string $phone Phone number to validate
     * @return bool True if valid format
     */
    public static function validatePhoneNumber($phone)
    {
        return preg_match('/^\d{3}-\d{3}-\d{4}$/', $phone) === 1;
    }

    /**
     * Validate if role is allowed
     * 
     * @param string $role Role to validate
     * @return bool True if valid role
     */
    public static function validateRole($role)
    {
        return in_array($role, self::VALID_ROLES);
    }

    /**
     * Get all valid roles
     * 
     * @return array Valid role strings
     */
    public static function getValidRoles()
    {
        return self::VALID_ROLES;
    }
}
