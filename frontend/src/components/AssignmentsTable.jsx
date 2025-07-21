import React from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button 
} from '@mui/material';

const AssignmentsTable = ({ assignments, staff, shifts }) => {
  if (assignments.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Staff Assignments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No assignments found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Staff Assignments
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Staff Name</TableCell>
              <TableCell>Staff Role</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Role Required</TableCell>
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
    </Paper>
  );
};

export default AssignmentsTable;
