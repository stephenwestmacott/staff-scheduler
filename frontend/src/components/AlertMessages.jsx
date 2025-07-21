import React from 'react';
import { Alert } from '@mui/material';

const AlertMessages = ({ error, success, onClear }) => {
  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={onClear}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={onClear}>
          {success}
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
