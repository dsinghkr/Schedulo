import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const roles = [
  'SuperAdmin', 'Admin', 'Manager', 'Asst-Manager', 'User'
];

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}
function validatePhone(phone) {
  return /^\d{10,15}$/.test(phone);
}
function validateName(name) {
  return name && name.trim().length >= 2;
}
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

function UserFormDialog({ open, onClose, onSave, user }) {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', role: 'User', password: '', teamId: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/teams').then(res => {
      setTeams(res.data);
      if (!user) {
        setForm({ name: '', email: '', phoneNumber: '', role: 'User', password: '', teamId: '' });
      } else {
        const validTeamId = user.teamId && res.data.some(t => String(t.id) === String(user.teamId)) ? String(user.teamId) : '';
        setForm({ ...user, teamId: validTeamId });
      }
    });
    setError('');
  }, [user, open]);

  // Prevent closing on backdrop click or escape
  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onClose();
  };

  const handleSave = async () => {
    if (!validateName(form.name)) {
      setError('Please enter a valid name (at least 2 characters).');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.phoneNumber && !validatePhone(form.phoneNumber)) {
      setError('Please enter a valid phone number (10-15 digits).');
      return;
    }
    if (!form.role) {
      setError('Please select a role.');
      return;
    }
    if (!form.teamId || isNaN(Number(form.teamId)) || !teams.some(t => String(t.id) === String(form.teamId))) {
      setError('Please select a valid team.');
      return;
    }
    if (!user && (!form.password || form.password.length < 6)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    try {
      await onSave({ ...form, teamId: Number(form.teamId) });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create user.');
    }
  };

  // Fixed label width for alignment
  const labelWidth = 120;
  const controlWidth = 260;

  // Strictly two controls per row, labels on the left side of controls
  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)', minHeight: 400 } }} disableEscapeKeyDown>
      <Box sx={{ background: 'linear-gradient(90deg, #2355a0 0%, #4f8cff 100%)', px: 3, py: 2, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{user && user.id ? 'Edit User' : 'Add User'}</Typography>
      </Box>
      <DialogContent sx={{ py: 4 }}>
        <Box component="form" sx={{ width: '100%' }}>
          <Grid container spacing={3} alignItems="center" justifyContent="flex-start">
            {/* Row 1: Name & Email */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Name <span style={{color:'red'}}>*</span></Box>
                <TextField required fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={!!error && error.toLowerCase().includes('name')} helperText={error && error.toLowerCase().includes('name') ? error : ''} sx={{ width: controlWidth }} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Email <span style={{color:'red'}}>*</span></Box>
                <TextField required fullWidth value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={!!error && error.toLowerCase().includes('email')} helperText={error && error.toLowerCase().includes('email') ? error : ''} sx={{ width: controlWidth }} />
              </Box>
            </Grid>
            {/* Row 2: Phone & Role */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Phone Number</Box>
                <TextField fullWidth value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} error={!!error && error.toLowerCase().includes('phone')} helperText={error && error.toLowerCase().includes('phone') ? error : ''} sx={{ width: controlWidth }} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Role <span style={{color:'red'}}>*</span></Box>
                <TextField select required fullWidth value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} error={!!error && error.toLowerCase().includes('role')} helperText={error && error.toLowerCase().includes('role') ? error : ''} sx={{ width: controlWidth }}>
                  {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Box>
            </Grid>
            {/* Row 3: Team & Password (if adding) */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Team <span style={{color:'red'}}>*</span></Box>
                <TextField select required fullWidth value={form.teamId} onChange={e => setForm({ ...form, teamId: e.target.value })} error={!!error && error.toLowerCase().includes('team')} helperText={error && error.toLowerCase().includes('team') ? error : ''} sx={{ width: controlWidth }}>
                  <MenuItem value="">Select a team</MenuItem>
                  {teams.map(team => <MenuItem key={team.id} value={String(team.id)}>{team.name}</MenuItem>)}
                </TextField>
              </Box>
            </Grid>
            {!user && <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Password <span style={{color:'red'}}>*</span></Box>
                <TextField required type="password" fullWidth value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} error={!!error && error.toLowerCase().includes('password')} helperText={error && error.toLowerCase().includes('password') ? error : ''} sx={{ width: controlWidth }} />
              </Box>
            </Grid>}
            {/* Error row */}
            {error && !['name','email','phone','role','password','team'].some(f => error.toLowerCase().includes(f)) && <Grid item xs={12}><Box color="red" mt={1}>{error}</Box></Grid>}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} sx={buttonSx}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" sx={primaryButtonSx}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [defaultRole, setDefaultRole] = useState('User');
  const [teams, setTeams] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await axios.get('/api/users');
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    axios.get('/api/teams').then(res => setTeams(res.data));
  }, []);

  const handleSave = async (form) => {
    // Always send teamId as a number
    const payload = { ...form, teamId: Number(form.teamId) };
    if (editUser) {
      await axios.put(`/api/users/${editUser.id}`, payload);
    } else {
      await axios.post('/api/users', payload);
    }
    setDialogOpen(false);
    setEditUser(null);
    fetchUsers();
  };

  const handleDelete = async (user) => {
    if (user.role === 'SuperAdmin') {
      alert('SuperAdmin user cannot be deleted.');
      return;
    }
    if (window.confirm('Delete this user?')) {
      await axios.delete(`/api/users/${user.id}`);
      fetchUsers();
    }
  };

  // When opening add user dialog, pass defaultRole
  const handleAddUser = () => {
    setEditUser({ role: defaultRole });
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Users</Typography>
        <Tooltip title="Add User"><IconButton color="primary" onClick={handleAddUser}><AddIcon /></IconButton></Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow> : users.map(user => {
              const teamName = teams.find(t => t.id === user.teamId)?.name || user.teamId;
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{teamName}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton color="primary" onClick={() => { setEditUser(user); setDialogOpen(true); }}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(user)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <UserFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} user={editUser} />
    </Box>
  );
}
