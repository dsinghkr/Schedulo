import React, { useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import TaskList from './TaskList';
import TaskDetailsPanel from './TaskDetailsPanel';

export default function AssistantDashboard() {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ textShadow: '2px 2px 8px #b0b0b0' }}>Assistant Manager Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)' }}>
            <TaskList
              title="Assigned Tasks"
              filter={{ /* add assistant filter here if needed */ }}
              pageSize={5}
              onSelectTask={setSelectedTask}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)' }}>
            <TaskList
              title="Team Pool Tasks"
              filter={{ /* add team filter here if needed */ }}
              pageSize={10}
              onSelectTask={setSelectedTask}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)' }}>
            <TaskList
              title="Ready for Review Queue"
              filter={{ status: 'completed' }}
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
  );
}
