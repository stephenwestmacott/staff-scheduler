import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  Button, TextField, Box, Alert, CircularProgress, MenuItem, Grid, Card, CardContent
} from '@mui/material';
import axios from '../api/axios';

const ShiftScheduler = () => {
  const [shifts, setShifts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  
  const [shiftFormData, setShiftFormData] = useState({
    day: '',
    start_time: '',
    end_time: '',
    role_required: ''
  });
  
  const [assignFormData, setAssignFormData] = useState({
    staff_id: '',
    shift_id: ''
  });

  const validRoles = ['Cook', 'Server', 'Manager'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Helper function to convert day name to date
  const convertDayToDate = (dayName) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const targetDay = daysOfWeek.indexOf(dayName) + 1; // Convert to 1-7 (Monday = 1)
    const actualTargetDay = targetDay === 7 ? 0 : targetDay; // Convert Sunday back to 0
    
    const daysUntilTarget = (actualTargetDay - currentDay + 7) % 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    
    return targetDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  };

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleShiftSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert day name to date and role to lowercase
    const formattedData = {
      ...shiftFormData,
      day: convertDayToDate(shiftFormData.day),
      role_required: shiftFormData.role_required.toLowerCase()
    };
    
    console.log('Sending shift data:', formattedData);
    
    axios.post('/shifts', formattedData)
      .then(() => {
        setSuccess('Shift created successfully!');
        setShiftFormData({ day: '', start_time: '', end_time: '', role_required: '' });
        setShowShiftForm(false);
        fetchData();
      })
      .catch(err => {
        console.error('Shift creation error:', err);
        console.error('Error response:', err.response);
        setError('Failed to create shift: ' + (err.response?.data?.error || err.message));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    axios.post('/assign', assignFormData)
      .then(() => {
        setSuccess('Staff assigned to shift successfully!');
        setAssignFormData({ staff_id: '', shift_id: '' });
        setShowAssignForm(false);
        fetchData();
      })
      .catch(err => {
        setError('Failed to assign staff: ' + (err.response?.data?.error || err.message));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
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
                    select
                    label="Day"
                    value={shiftFormData.day}
                    onChange={(e) => setShiftFormData({...shiftFormData, day: e.target.value})}
                    fullWidth
                    margin="normal"
                    required
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>{day}</MenuItem>
                    ))}
                  </TextField>
                  
                  <TextField
                    type="time"
                    label="Start Time"
                    value={shiftFormData.start_time}
                    onChange={(e) => setShiftFormData({...shiftFormData, start_time: e.target.value})}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                  
                  <TextField
                    type="time"
                    label="End Time"
                    value={shiftFormData.end_time}
                    onChange={(e) => setShiftFormData({...shiftFormData, end_time: e.target.value})}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
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
  );
};

export default ShiftScheduler;
