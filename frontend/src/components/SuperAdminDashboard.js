import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import FilterListIcon from '@mui/icons-material/FilterList';
import BarChartIcon from '@mui/icons-material/BarChart';
import DownloadIcon from '@mui/icons-material/Download';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>SuperAdmin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)', border: '1px solid #e3e6ee', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 16px 32px 0 rgba(31,38,135,0.27)' } }} onClick={() => navigate('/dashboard/tasks')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Work in Progress (Team-wise)</Typography>
                <IconButton color="primary" onClick={e => { e.stopPropagation(); navigate('/dashboard/tasks'); }}><AssignmentIcon /></IconButton>
              </Box>
              <Typography color="text.secondary">Monitor all teams' ongoing tasks.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)', border: '1px solid #e3e6ee', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 16px 32px 0 rgba(31,38,135,0.27)' } }} onClick={() => navigate('/dashboard/sealed')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Sealed Items (This Week)</Typography>
                <IconButton color="success" onClick={e => { e.stopPropagation(); navigate('/dashboard/sealed'); }}><CheckCircleIcon /></IconButton>
              </Box>
              <Typography color="text.secondary">View tasks sealed in the current week.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)', border: '1px solid #e3e6ee', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 16px 32px 0 rgba(31,38,135,0.27)' } }} onClick={() => navigate('/dashboard/returned')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Returned/Pending/Overdue</Typography>
                <IconButton color="warning" onClick={e => { e.stopPropagation(); navigate('/dashboard/returned'); }}><ReplayIcon /></IconButton>
              </Box>
              <Typography color="text.secondary">Track returned, pending, and overdue items.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)', border: '1px solid #e3e6ee', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 16px 32px 0 rgba(31,38,135,0.27)' } }} onClick={() => navigate('/dashboard/filters')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Filters</Typography>
                <IconButton color="info" onClick={e => { e.stopPropagation(); navigate('/dashboard/filters'); }}><FilterListIcon /></IconButton>
              </Box>
              <Typography color="text.secondary">Filter by Task Category and Client.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)', border: '1px solid #e3e6ee', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 16px 32px 0 rgba(31,38,135,0.27)' } }} onClick={() => navigate('/dashboard/reports')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">User Work Reports</Typography>
                <IconButton color="secondary" onClick={e => { e.stopPropagation(); navigate('/dashboard/reports'); }}><BarChartIcon /></IconButton>
              </Box>
              <Typography color="text.secondary">View daily, weekly, and monthly reports.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)', border: '1px solid #e3e6ee', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 16px 32px 0 rgba(31,38,135,0.27)' } }} onClick={() => setExportDialogOpen(true)}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Export</Typography>
                <IconButton color="primary" onClick={e => { e.stopPropagation(); setExportDialogOpen(true); }}><DownloadIcon /></IconButton>
              </Box>
              <Typography color="text.secondary">Export data to Excel or PDF.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Typography>Choose export format:</Typography>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<DownloadIcon />} onClick={() => { window.open('/api/reports/export-tasks-excel', '_blank'); setExportDialogOpen(false); }}>Excel</Button>
          <Button startIcon={<DownloadIcon />} onClick={() => { window.open('/api/reports/export-tasks-pdf', '_blank'); setExportDialogOpen(false); }}>PDF</Button>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
