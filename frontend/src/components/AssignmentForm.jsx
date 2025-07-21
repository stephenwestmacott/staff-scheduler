import React from 'react';
import { Paper, Typography, TextField, MenuItem, Button, Box } from '@mui/material';

const AssignmentForm = ({ formData, staff, shifts, onFormChange, onSubmit, onCancel }) => {
  const updateForm = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Assign Staff to Shift
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          select
          label="Staff Member"
          value={formData.staff_id}
          onChange={(e) => updateForm('staff_id', e.target.value)}
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
          value={formData.shift_id}
          onChange={(e) => updateForm('shift_id', e.target.value)}
          required
        >
          {shifts.map((shift) => (
            <MenuItem key={shift.id} value={shift.id}>
              {shift.day} - {shift.start_time} to {shift.end_time} ({shift.role_required})
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Assign Staff
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AssignmentForm;
