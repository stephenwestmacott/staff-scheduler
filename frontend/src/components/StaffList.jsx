import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  Button, TextField, Box, Alert, CircularProgress, MenuItem
} from '@mui/material';
import axios from '../api/axios';

/**
 * StaffTable Component
 * 
 * Manages staff member data including creation, validation, and display.
 * Provides a comprehensive interface for:
 * - Adding new staff members with form validation
 * - Displaying all staff members in a data table
 * - Real-time phone number formatting and validation
 * - Role selection with predefined options
 * 
 * Features:
 * - Automatic phone number formatting (xxx-xxx-xxxx)
 * - Real-time validation with user feedback
 * - Responsive Material-UI design
 * - Error handling and loading states
 */
const StaffTable = () => {
  // State management for staff data and UI
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Valid roles constant - matches backend validation
  const validRoles = ['Cook', 'Server', 'Manager'];

  /**
   * Validates phone number format
   * Ensures phone follows xxx-xxx-xxxx pattern (e.g., 306-555-1234)
   * 
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if format is valid, false otherwise
   */
  const validatePhoneNumber = (phone) => {
    // Phone format: xxx-xxx-xxxx (area code - 3 digits - 4 digits)
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  /**
   * Formats phone number as user types
   * Automatically adds dashes in appropriate positions
   * Limits input to 10 digits maximum
   * 
   * @param {string} value - Raw input value
   * @returns {string} Formatted phone number
   */

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply formatting as user types
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return digits.slice(0, 3) + '-' + digits.slice(3);
    } else {
      return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6, 10);
    }
  };

  /**
   * Fetches all staff members from the API
   * Updates component state with staff data and handles errors
   */
  const fetchStaff = () => {
    setLoading(true);
    axios.get('/staff')
      .then(res => {
        setStaff(res.data);
        setError('');
      })
      .catch(err => {
        console.error('Failed to fetch staff', err);
        setError('Failed to fetch staff data');
      })
      .finally(() => setLoading(false));
  };

  // Load staff data when component mounts
  useEffect(() => {
    fetchStaff();
  }, []);

  /**
   * Handles form input changes with real-time validation
   * Applies phone number formatting and validation for phone field
   * 
   * @param {Event} e - Input change event
   */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    let newErrors = { ...formErrors };

    if (name === 'phone') {
      // Format phone number as user types
      processedValue = formatPhoneNumber(value);
      
      // Validate phone number
      if (processedValue && !validatePhoneNumber(processedValue)) {
        newErrors.phone = 'Phone must be in format xxx-xxx-xxxx';
      } else {
        delete newErrors.phone;
      }
    }

    setFormErrors(newErrors);
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  /**
   * Handles form submission for creating new staff member
   * Validates form data and submits to API
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data - focus on phone format validation
    const errors = {};
    if (!formData.phone.trim() || !validatePhoneNumber(formData.phone)) {
      errors.phone = 'Phone must be in format xxx-xxx-xxxx';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setError('Please fix the validation errors below');
      return;
    }

    // Submit form data to API
    setLoading(true);
    setError('');
    setSuccess('');
    setFormErrors({});

    axios.post('/staff', formData)
      .then(res => {
        setSuccess('Staff member added successfully!');
        setFormData({ name: '', role: '', phone: '' });
        setShowForm(false);
        fetchStaff(); // Refresh the list
      })
      .catch(err => {
        console.error('Failed to add staff', err);
        setError('Failed to add staff member. Please check all fields are filled.');
      })
      .finally(() => setLoading(false));
  };

  /**
   * Resets form to initial state and closes form
   * Clears all form data, errors, and messages
   */

  const resetForm = () => {
    setFormData({ name: '', role: '', phone: '' });
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header Section - Title and Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Staff Manager</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Staff Member'}
        </Button>
      </Box>

      {/* Alert Messages - Success and Error Notifications */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Staff Creation Form - Conditional Rendering */}
      {showForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Staff Member</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Name Input Field */}
            <TextField
              name="name"
              label="Full Name"
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            {/* Role Selection Dropdown */}
            <TextField
              name="role"
              label="Role"
              variant="outlined"
              select
              value={formData.role}
              onChange={handleInputChange}
              required
              fullWidth
            >
              {validRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            {/* Phone Input with Real-time Formatting and Validation */}
            <TextField
              name="phone"
              label="Phone Number (xxx-xxx-xxxx)"
              variant="outlined"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              required
              fullWidth
            />
            {/* Form Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Add Staff Member'}
              </Button>
              <Button 
                type="button" 
                variant="outlined" 
                onClick={resetForm}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Staff Data Table - Displays All Staff Members */}
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ m: 2 }}>
          Staff Members
        </Typography>
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          {/* Table Body - Dynamic Content Based on State */}
          <TableBody>
            {loading ? (
              // Loading State - Show spinner
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', p: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : staff.length === 0 ? (
              // Empty State - No staff members found
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', p: 4 }}>
                  No staff members found. Add your first staff member above!
                </TableCell>
              </TableRow>
            ) : (
              // Data State - Display staff members
              staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StaffTable;
