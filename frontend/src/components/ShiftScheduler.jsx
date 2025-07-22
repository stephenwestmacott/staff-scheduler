import React, { useEffect, useState } from 'react';
import {
  Typography, Button, Box, CircularProgress, Grid, Card, CardContent
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from '../api/axios';
import { VALID_ROLES, INITIAL_SHIFT_FORM, INITIAL_ASSIGN_FORM } from '../constants';
import { useAlertMessages } from '../hooks/useAlertMessages';
import AlertMessages from './AlertMessages';
import ShiftsTable from './ShiftsTable';
import AssignmentsTable from './AssignmentsTable';
import ShiftForm from './ShiftForm';
import AssignmentForm from './AssignmentForm';

// Constants
const ROLES = VALID_ROLES;

/**
 * ShiftScheduler Component
 * 
 * Manages shift creation and staff assignment functionality.
 */
const ShiftScheduler = () => {
  // Data state management
  const [shifts, setShifts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // UI state management
  const [activeForm, setActiveForm] = useState('none');
  const [shiftFormData, setShiftFormData] = useState(INITIAL_SHIFT_FORM);
  const [assignFormData, setAssignFormData] = useState(INITIAL_ASSIGN_FORM);

  // Alert messages using custom hook
  const { error, success, clearMessages, showError, showSuccess } = useAlertMessages();


  /**
   * Fetches all data from the API
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
      showSuccess(''); // Clear any existing messages
    })
    .catch(err => {
      showError('Failed to load data: ' + (err.response?.data?.error || err.message));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShiftSubmit = () => {
    setLoading(true);
    
    const formattedData = {
      day: shiftFormData.date,
      start_time: shiftFormData.start_time ? shiftFormData.start_time + ':00' : '',
      end_time: shiftFormData.end_time ? shiftFormData.end_time + ':00' : '',
      role_required: shiftFormData.role_required.toLowerCase()
    };
    
    axios.post('/shifts', formattedData)
      .then(() => {
        showSuccess('Shift created successfully!');
        setShiftFormData(INITIAL_SHIFT_FORM);
        setActiveForm('none');
        fetchData();
      })
      .catch(err => {
        showError('Failed to create shift: ' + (err.response?.data?.error || err.message));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAssignSubmit = () => {
    setLoading(true);
    
    axios.post('/assign', assignFormData)
      .then(() => {
        showSuccess('Staff assigned to shift successfully!');
        setAssignFormData(INITIAL_ASSIGN_FORM);
        setActiveForm('none');
        fetchData();
      })
      .catch(err => {
        showError('Failed to assign staff: ' + (err.response?.data?.error || err.message));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Scheduler
        </Typography>

        <AlertMessages error={error} success={success} onClear={clearMessages} />

        {loading && (
          <Box display="flex" justifyContent="center" m={2}>
            <CircularProgress />
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Create Shift
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Schedule a new shift for your team members.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setActiveForm('shift')}
                  sx={{ mt: 2 }}
                >
                  Create New Shift
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Assign Staff to Shift
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Assign available staff members to existing shifts.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setActiveForm('assign')}
                  sx={{ mt: 2 }}
                >
                  Assign Staff
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {activeForm === 'shift' && (
          <ShiftForm
            open={true}
            onCancel={() => setActiveForm('none')}
            onSubmit={handleShiftSubmit}
            formData={shiftFormData}
            onFormChange={setShiftFormData}
            loading={loading}
          />
        )}

        {activeForm === 'assign' && (
          <AssignmentForm
            open={true}
            onCancel={() => setActiveForm('none')}
            onSubmit={handleAssignSubmit}
            formData={assignFormData}
            onFormChange={setAssignFormData}
            shifts={shifts}
            staff={staff}
            loading={loading}
          />
        )}

        <ShiftsTable shifts={shifts} />
        <AssignmentsTable assignments={assignments} staff={staff} shifts={shifts} />
      </Box>
    </LocalizationProvider>
  );
};

export default ShiftScheduler;
