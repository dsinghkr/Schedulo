import React from 'react';
import { Grid, Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';

export default function ImportExportDashboard() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>Import / Export</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer' }} onClick={() => navigate('/dashboard/customers')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Customers (Excel)</Typography>
                <Box>
                  <IconButton color="primary"><UploadFileIcon /></IconButton>
                  <IconButton color="primary"><DownloadIcon /></IconButton>
                </Box>
              </Box>
              <Typography color="text.secondary">Import/export customer data via Excel.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer' }} onClick={() => navigate('/dashboard/categories')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Categories</Typography>
                <IconButton color="primary"><CategoryIcon /></IconButton>
              </Box>
              <Typography color="text.secondary">Manage task categories.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer' }} onClick={() => navigate('/dashboard/tasks')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Tasks</Typography>
                <IconButton color="primary"><AssignmentIcon /></IconButton>
              </Box>
              <Typography color="text.secondary">Import/export and manage tasks.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
