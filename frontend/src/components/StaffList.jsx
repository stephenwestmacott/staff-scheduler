import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  Button, TextField, Box, Alert, CircularProgress, MenuItem
} from '@mui/material';
import axios from '../api/axios';

const StaffTable = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const validRoles = ['Cook', 'Server', 'Manager'];

  const validatePhoneNumber = (phone) => {
    // Phone format: xxx-xxx-xxxx (area code - 3 digits - 4 digits)
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

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

  useEffect(() => {
    fetchStaff();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation - only check phone format
    const errors = {};
    if (!formData.phone.trim() || !validatePhoneNumber(formData.phone)) {
      errors.phone = 'Phone must be in format xxx-xxx-xxxx';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setError('Please fix the validation errors below');
      return;
    }

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

  const resetForm = () => {
    setFormData({ name: '', role: '', phone: '' });
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with Add Button */}
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

      {/* Success/Error Messages */}
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

      {/* Add Staff Form */}
      {showForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Staff Member</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Full Name"
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
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

      {/* Staff Table */}
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ m: 2 }}>
          Staff Members
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', p: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', p: 4 }}>
                  No staff members found. Add your first staff member above!
                </TableCell>
              </TableRow>
            ) : (
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
};export default StaffTable;
