import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Button, TextField, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import FormDialog from './FormDialog';
import FormRow from './FormRow';

const buttonSx = {
  borderRadius: 2,
  boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)',
  background: '#fff',
  color: '#2355a0',
  fontWeight: 600
};
const primaryButtonSx = {
  borderRadius: 2,
  boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)',
  background: 'linear-gradient(90deg, #4f8cff 0%, #2355a0 100%)',
  color: '#fff',
  fontWeight: 600
};

function TaskFormDialog({ open, onClose, onSave, task, categories = [] }) {
  const [form, setForm] = useState(task || { name: '', description: '', categoryId: '', startDate: '', dueDate: '', status: 'pending' });
  const [error, setError] = useState('');
  useEffect(() => { setForm(task || { name: '', description: '', categoryId: '', startDate: '', dueDate: '', status: 'pending' }); setError(''); }, [task]);
  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onClose();
  };
  const handleSave = () => {
    if (!form.name || !form.categoryId || !form.startDate || !form.dueDate) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    onSave(form);
  };
  return (
    <FormDialog
      open={open}
      onClose={handleDialogClose}
      title={task ? 'Edit Task' : 'Add Task'}
      actions={[
        <Button key="cancel" onClick={onClose} sx={buttonSx}>Cancel</Button>,
        <Button key="save" onClick={handleSave} variant="contained" sx={primaryButtonSx}>Save</Button>
      ]}
    >
      {/* Row 1: Name & Category */}
      <Box display="flex" gap={2} mb={2}>
        <FormRow label="Name" required>
          <TextField fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </FormRow>
        <FormRow label="Category" required>
          <TextField select fullWidth value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
            {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
        </FormRow>
      </Box>
      {/* Row 2: Description & Start Date */}
      <Box display="flex" gap={2} mb={2}>
        <FormRow label="Description">
          <TextField fullWidth value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
        </FormRow>
        <FormRow label="Start Date" required>
          <TextField type="date" fullWidth value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} InputLabelProps={{ shrink: true }} />
        </FormRow>
      </Box>
      {/* Row 3: Due Date & Status */}
      <Box display="flex" gap={2} mb={2}>
        <FormRow label="Due Date" required>
          <TextField type="date" fullWidth value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} />
        </FormRow>
        <FormRow label="Status">
          <TextField select fullWidth value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="sealed">Sealed</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
        </FormRow>
      </Box>
      {error && <Box color="red" mt={1}>{error}</Box>}
    </FormDialog>
  );
}

export default function TaskMasterList() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const fileInputRef = useRef();

  const fetchAll = async () => {
    setLoading(true);
    const [taskRes, catRes] = await Promise.all([
      axios.get('/api/tasks'),
      axios.get('/api/categories'),
    ]);
    setTasks(taskRes.data);
    setCategories(catRes.data);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (form) => {
    if (editTask) {
      await axios.put(`/api/tasks/${editTask.id}`, form);
    } else {
      await axios.post('/api/tasks', form);
    }
    setDialogOpen(false);
    setEditTask(null);
    fetchAll();
  };

  const handleDelete = async (task) => {
    if (window.confirm('Delete this task?')) {
      await axios.delete(`/api/tasks/${task.id}`);
      fetchAll();
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('/api/import/tasks', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    fetchAll();
    fileInputRef.current.value = '';
  };

  const handleExport = () => {
    window.open('/api/reports/export-tasks-excel', '_blank');
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Tasks</Typography>
        <Box>
          <Tooltip title="Import from Excel">
            <IconButton color="primary" component="label" sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)', background: '#fff', color: '#2355a0', mr: 1, '&:hover': { background: '#e3e6ee' } }}>
              <UploadFileIcon />
              <input type="file" accept=".xlsx,.xls" hidden onChange={handleImport} ref={fileInputRef} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton color="primary" onClick={handleExport} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)', background: '#fff', color: '#2355a0', mr: 1, '&:hover': { background: '#e3e6ee' } }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Task">
            <IconButton color="primary" onClick={() => { setEditTask(null); setDialogOpen(true); }} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)', background: '#fff', color: '#2355a0', '&:hover': { background: '#e3e6ee' } }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow> : tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{categories.find(c => c.id === task.categoryId)?.name || ''}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.startDate?.slice(0, 10)}</TableCell>
                <TableCell>{task.dueDate?.slice(0, 10)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => { setEditTask(task); setDialogOpen(true); }} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)', background: '#fff', color: '#2355a0', mr: 1, '&:hover': { background: '#e3e6ee' } }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(task)} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)', background: '#fff', color: '#d32f2f', '&:hover': { background: '#fdecea' } }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TaskFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} task={editTask} categories={categories} />
    </Box>
  );
}
