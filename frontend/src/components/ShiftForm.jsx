import React from 'react';
import { Paper, Typography, TextField, MenuItem, Button, Box } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { VALID_ROLES } from '../constants';
import dayjs from 'dayjs';

const ShiftForm = ({ formData, onFormChange, onSubmit, onCancel }) => {
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
        Create New Shift
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DatePicker
          label="Date"
          value={formData.date ? dayjs(formData.date) : null}
          onChange={(newDate) => updateForm('date', newDate ? newDate.format('YYYY-MM-DD') : '')}
          renderInput={(params) => <TextField {...params} required />}
        />

        <TimePicker
          label="Start Time"
          value={formData.start_time ? dayjs(formData.start_time, 'HH:mm') : null}
          onChange={(newTime) => updateForm('start_time', newTime ? newTime.format('HH:mm') : '')}
          renderInput={(params) => <TextField {...params} required />}
        />

        <TimePicker
          label="End Time"
          value={formData.end_time ? dayjs(formData.end_time, 'HH:mm') : null}
          onChange={(newTime) => updateForm('end_time', newTime ? newTime.format('HH:mm') : '')}
          renderInput={(params) => <TextField {...params} required />}
        />

        <TextField
          select
          label="Role"
          value={formData.role_required}
          onChange={(e) => updateForm('role_required', e.target.value)}
          required
        >
          {VALID_ROLES.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Create Shift
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ShiftForm;
