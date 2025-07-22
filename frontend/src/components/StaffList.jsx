import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  Button, TextField, Box, Alert, CircularProgress, MenuItem
} from '@mui/material';
import axios from '../api/axios';

// Constants
const VALID_ROLES = ['Cook', 'Server', 'Manager'];
const INITIAL_FORM_DATA = { name: '', role: '', phone: '' };
const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;

/**
 * StaffTable Component
 * 
 * Manages staff member data including creation, validation, and display.
 */
const StaffTable = () => {
  // State management
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const validatePhoneNumber = (phone) => {
    return PHONE_REGEX.test(phone);
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    
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
   */
  const fetchStaff = () => {
    setLoading(true);
    axios.get('/staff')
      .then(res => {
        setStaff(res.data);
        setError('');
      })
      .catch(err => {
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
      processedValue = formatPhoneNumber(value);
      
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
        setFormData(INITIAL_FORM_DATA);
        setShowForm(false);
        fetchStaff();
      })
      .catch(err => {
        setError('Failed to add staff member. Please check all fields are filled.');
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 2 }}>
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
              {VALID_ROLES.map((role) => (
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
};

export default StaffTable;
