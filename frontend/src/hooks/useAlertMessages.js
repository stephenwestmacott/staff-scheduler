import { useState } from 'react';

/**
 * Custom hook for managing alert messages (error and success states)
 * 
 * @returns {Object} Object containing error, success states and helper functions
 */
export const useAlertMessages = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const showError = (message) => {
    setError(message);
    setSuccess(''); // Clear success when showing error
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setError(''); // Clear error when showing success
  };

  return {
    error,
    success,
    clearMessages,
    showError,
    showSuccess
  };
};
