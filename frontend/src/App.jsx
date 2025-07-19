import React, { useState } from 'react';
import { Box, Tabs, Tab, Container } from '@mui/material';
import StaffTable from './components/StaffList';
import ShiftScheduler from './components/ShiftScheduler';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Staff Management" />
          <Tab label="Shift Scheduling" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <StaffTable />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <ShiftScheduler />
      </TabPanel>
    </Container>
  );
}

export default App;
