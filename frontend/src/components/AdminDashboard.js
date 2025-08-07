import React, { useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import TaskList from './TaskList';
import TaskDetailsPanel from './TaskDetailsPanel';

export default function AdminDashboard() {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <Box sx={{
      p: 0, // Remove default padding
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    }}>
      <Box sx={{ px: 3, pt: 3, pb: 0 }}>
        <Typography variant="h4" gutterBottom sx={{ textShadow: '2px 2px 8px #b0b0b0', mb: 0 }}>
          Admin Dashboard
        </Typography>
      </Box>
      <Box sx={{ flex: 1, px: 3, pt: 0, pb: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)' }}>
              <TaskList
                title="Assigned Tasks"
                filter={{ /* add admin filter here if needed */ }}
                pageSize={5}
                onSelectTask={setSelectedTask}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)' }}>
              <TaskList
                title="Team Pool Tasks"
                filter={{ /* add team filter here if needed */ }}
                pageSize={10}
                onSelectTask={setSelectedTask}
              />
            </Paper>
          </Grid>
        </Grid>
        {selectedTask && (
          <TaskDetailsPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </Box>
    </Box>
  );
}
