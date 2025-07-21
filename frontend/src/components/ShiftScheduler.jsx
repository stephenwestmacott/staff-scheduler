import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  Button, TextField, Box, Alert, CircularProgress, MenuItem, Grid, Card, CardContent
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from '../api/axios';

/**
 * ShiftScheduler Component
 * 
 * Manages shift creation and staff assignment functionality.
 * Provides interfaces for:
 * - Creating new shifts with day, time, and role requirements
 * - Assigning staff members to shifts with role validation
 * - Viewing all shifts and current assignments
 * 
 * Features:
 * - Automatic day name to date conversion
 * - Role case conversion for API compatibility
 * - Real-time validation and user feedback
 * - Responsive Material-UI design
 */

const ShiftScheduler = () => {
  // State management for data and UI
  const [shifts, setShifts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form visibility state
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  
  // Form data state
  const [shiftFormData, setShiftFormData] = useState({
    date: '',
    start_time: null,
    end_time: null,
    role_required: ''
  });
  
  const [assignFormData, setAssignFormData] = useState({
    staff_id: '',
    shift_id: ''
  });

  // Constants for validation and form options
  const validRoles = ['Cook', 'Server', 'Manager'];

  /**
   * Fetches all data from the API (shifts, staff, assignments)
   * Updates state with the retrieved data and handles errors gracefully
   */
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      axios.get('/shifts'),
      axios.get('/staff'),
      axios.get('/assignments')
    ])
    .then(([shiftsRes, staffRes, assignmentsRes]) => {
      setShifts(shiftsRes.data);
      setStaff(staffRes.data);
      setAssignments(assignmentsRes.data);
      setError('');
    })
    .catch(err => {
      setError('Failed to load data: ' + (err.response?.data?.error || err.message));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Handles shift creation form submission
   * Transforms form data for API compatibility and validates input
   * 
   * @param {Event} e - Form submission event
   */

  const handleShiftSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Transform form data for API compatibility
    const formattedData = {
      day: shiftFormData.date,
      start_time: shiftFormData.start_time ? dayjs(shiftFormData.start_time).format('HH:mm:ss') : '',
      end_time: shiftFormData.end_time ? dayjs(shiftFormData.end_time).format('HH:mm:ss') : '',
      role_required: shiftFormData.role_required.toLowerCase()
    };
    
    axios.post('/shifts', formattedData)
      .then(() => {
        setSuccess('Shift created successfully!');
        setShiftFormData({ date: '', start_time: null, end_time: null, role_required: '' });
        setShowShiftForm(false);
        fetchData();
      })
      .catch(err => {
        setError('Failed to create shift: ' + (err.response?.data?.error || err.message));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Handles staff assignment form submission
   * Assigns a staff member to a selected shift with backend validation
   * 
   * @param {Event} e - Form submission event
   */
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    axios.post('/assign', assignFormData)
      .then(() => {
        setSuccess('Staff assigned to shift successfully!');
        setAssignFormData({ staff_id: '', shift_id: '' });
        setShowAssignForm(false);
        fetchData(); // Refresh data
      })
      .catch(err => {
        setError('Failed to assign staff: ' + (err.response?.data?.error || err.message));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Clears success and error messages
   */
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shift Scheduler
        </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>{success}</Alert>}

      <Grid container spacing={3}>
        
        {/* Create Shift Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create New Shift
              </Typography>
              
              {!showShiftForm ? (
                <Button 
                  variant="contained" 
                  onClick={() => setShowShiftForm(true)}
                  fullWidth
                >
                  Add New Shift
                </Button>
              ) : (
                <Box component="form" onSubmit={handleShiftSubmit}>
                  <TextField
                    type="date"
                    label="Date"
                    value={shiftFormData.date}
                    onChange={(e) => setShiftFormData({...shiftFormData, date: e.target.value})}
                    fullWidth
                    margin="normal"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  
                  <TimePicker
                    label="Start Time"
                    value={shiftFormData.start_time}
                    onChange={(newValue) => setShiftFormData({...shiftFormData, start_time: newValue})}
                  />

                  <TimePicker
                    label="End Time"
                    value={shiftFormData.end_time}
                    onChange={(newValue) => setShiftFormData({...shiftFormData, end_time: newValue})}
                  />
                  
                  <TextField
                    select
                    label="Role Required"
                    value={shiftFormData.role_required}
                    onChange={(e) => setShiftFormData({...shiftFormData, role_required: e.target.value})}
                    fullWidth
                    margin="normal"
                    required
                  >
                    {validRoles.map((role) => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </TextField>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button type="submit" variant="contained" disabled={loading}>
                      {loading ? <CircularProgress size={20} /> : 'Create Shift'}
                    </Button>
                    <Button onClick={() => setShowShiftForm(false)} variant="outlined">
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Assign Staff Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assign Staff to Shift
              </Typography>
              
              {!showAssignForm ? (
                <Button 
                  variant="contained" 
                  onClick={() => setShowAssignForm(true)}
                  fullWidth
                  color="secondary"
                >
                  Assign Staff
                </Button>
              ) : (
                <Box component="form" onSubmit={handleAssignSubmit}>
                  <TextField
                    select
                    label="Staff Member"
                    value={assignFormData.staff_id}
                    onChange={(e) => setAssignFormData({...assignFormData, staff_id: e.target.value})}
                    fullWidth
                    margin="normal"
                    required
                  >
                    {staff.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </MenuItem>
                    ))}
                  </TextField>
                  
                  <TextField
                    select
                    label="Shift"
                    value={assignFormData.shift_id}
                    onChange={(e) => setAssignFormData({...assignFormData, shift_id: e.target.value})}
                    fullWidth
                    margin="normal"
                    required
                  >
                    {shifts.map((shift) => (
                      <MenuItem key={shift.id} value={shift.id}>
                        {shift.day} {shift.start_time}-{shift.end_time} ({shift.role_required})
                      </MenuItem>
                    ))}
                  </TextField>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button type="submit" variant="contained" disabled={loading} color="secondary">
                      {loading ? <CircularProgress size={20} /> : 'Assign Staff'}
                    </Button>
                    <Button onClick={() => setShowAssignForm(false)} variant="outlined">
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Shifts Table */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Available Shifts
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Role Required</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell>{shift.day}</TableCell>
                      <TableCell>{shift.start_time}</TableCell>
                      <TableCell>{shift.end_time}</TableCell>
                      <TableCell>{shift.role_required}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        {/* Assignments Table */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Current Assignments
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Day</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Required Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.assignment_id}>
                    <TableCell>{assignment.staff_name}</TableCell>
                    <TableCell>{assignment.staff_role}</TableCell>
                    <TableCell>{assignment.day}</TableCell>
                    <TableCell>{assignment.start_time} - {assignment.end_time}</TableCell>
                    <TableCell>{assignment.role_required}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

      </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default ShiftScheduler;
