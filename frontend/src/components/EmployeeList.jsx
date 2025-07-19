import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('/staff')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Failed to fetch staff:', err));
  }, []);

  console.log('Employees:', employees);
}

