import axios from 'axios';

// Determine the base URL based on the current environment
const getBaseURL = () => {
  // If we're in development and accessing via IP (mobile testing)
  if (window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:8000`;
  }
  // Default to localhost for local development
  return 'http://localhost:8000';
};

const instance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;