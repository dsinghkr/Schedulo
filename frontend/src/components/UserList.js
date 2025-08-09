import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockResetIcon from '@mui/icons-material/LockReset';
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
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', role: 'User', password: '', teamId: null });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('/api/teams').then(res => {
      setTeams(res.data);
      // Only reset form for add, not for edit
      if (!user || !user.id) {
        setForm({ name: '', email: '', phoneNumber: '', role: 'User', password: '', teamId: null });
      } else {
        const validTeamId = user.teamId && res.data.some(t => String(t.id) === String(user.teamId)) ? String(user.teamId) : null;
        setForm({ ...user, teamId: validTeamId });
      }
    });
    setErrors({});
  }, [user, open]);

  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onClose();
  };

  const validate = () => {
    const newErrors = {};
    if (!validateName(form.name)) newErrors.name = 'Please enter a valid name (at least 2 characters).';
    if (!validateEmail(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (form.phoneNumber && !validatePhone(form.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid phone number (10-15 digits).';
    if (!form.role) newErrors.role = 'Please select a role.';
    // Team is optional, so no validation here
    if (!user && (!form.password || form.password.length < 6)) newErrors.password = 'Password must be at least 6 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    let teamIdToSend = null;
    if (form.teamId && !isNaN(Number(form.teamId)) && form.teamId !== 'undefined') {
      teamIdToSend = Number(form.teamId);
    }
    try {
      await onSave({ ...form, teamId: teamIdToSend });
    } catch (err) {
      setErrors({ form: err?.response?.data?.message || 'Failed to create user.' });
    }
  };

  // Fixed label width for alignment
  const labelWidth = 120;
  const controlWidth = 260;

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
                <TextField required fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={!!errors.name} helperText={errors.name} sx={{ width: controlWidth }} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Email <span style={{color:'red'}}>*</span></Box>
                <TextField required fullWidth value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={!!errors.email} helperText={errors.email} sx={{ width: controlWidth }} />
              </Box>
            </Grid>
            {/* Row 2: Phone & Role */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Phone Number</Box>
                <TextField fullWidth value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} error={!!errors.phoneNumber} helperText={errors.phoneNumber} sx={{ width: controlWidth }} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Role <span style={{color:'red'}}>*</span></Box>
                <TextField select required fullWidth value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} error={!!errors.role} helperText={errors.role} sx={{ width: controlWidth }}>
                  {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Box>
            </Grid>
            {/* Row 3: Team & Password (if adding) */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Team</Box>
                <TextField select fullWidth value={form.teamId ?? ''} onChange={e => setForm({ ...form, teamId: e.target.value || null })} error={!!errors.teamId} helperText={errors.teamId} sx={{ width: controlWidth }}>
                  <MenuItem value="">No team</MenuItem>
                  {teams.map(team => <MenuItem key={team.id} value={String(team.id)}>{team.name}</MenuItem>)}
                </TextField>
              </Box>
            </Grid>
            {!user && <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }}>Password <span style={{color:'red'}}>*</span></Box>
                <TextField required type="password" fullWidth value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} error={!!errors.password} helperText={errors.password} sx={{ width: controlWidth }} />
              </Box>
            </Grid>}
            {/* Error row for form-level errors */}
            {errors.form && <Grid item xs={12}><Box color="red" mt={1}>{errors.form}</Box></Grid>}
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

function SetPasswordDialog({ open, onClose, onSave, user }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setPassword('');
    setConfirm('');
    setError('');
  }, [open]);

  const handleSave = async () => {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await onSave(password);
      onClose();
    } catch (err) {
      // Show backend error if available
      setError(err?.response?.data?.message || err.message || 'Failed to set password.');
    }
  };

  // Match UserFormDialog styling
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)', minHeight: 300 } }}>
      <Box sx={{ background: 'linear-gradient(90deg, #2355a0 0%, #4f8cff 100%)', px: 3, py: 2, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Set Password for {user?.name}</Typography>
      </Box>
      <DialogContent sx={{ py: 4 }}>
        <TextField
          label="Enter Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        {error && <Box color="red" mt={1}>{error}</Box>}
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
  const [setPwdUser, setSetPwdUser] = useState(null);
  const [setPwdOpen, setSetPwdOpen] = useState(false);

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
    // Only send teamId as a number if it is a valid value, otherwise send null
    let teamIdToSend = null;
    if (form.teamId && !isNaN(Number(form.teamId)) && form.teamId !== 'undefined') {
      teamIdToSend = Number(form.teamId);
    }
    const payload = { ...form, teamId: teamIdToSend };
    if (editUser && editUser.id) {
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

  // Duplicate user handler
  const handleDuplicate = (user) => {
    // Remove id, email, password for new user
    const { id, email, password, createdAt, updatedAt, ...rest } = user;
    setEditUser({ ...rest });
    setDialogOpen(true);
  };

  // Set password handler
  const handleSetPassword = async (user, password) => {
    if (!user || !user.id) {
      alert('User ID is missing. Cannot reset password.');
      return;
    }
    console.log('Resetting password for user:', user);
    await axios.post(`/api/users/${user.id}/reset-password`, { password });
    fetchUsers();
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
                    <Tooltip title="Duplicate"><IconButton color="secondary" onClick={() => handleDuplicate(user)}><ContentCopyIcon /></IconButton></Tooltip>
                    <Tooltip title="Set Password"><IconButton color="info" onClick={() => { setSetPwdUser(user); setSetPwdOpen(true); }}><LockResetIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(user)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <UserFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} user={editUser} />
      <SetPasswordDialog open={setPwdOpen} onClose={() => setSetPwdOpen(false)} user={setPwdUser} onSave={pwd => handleSetPassword(setPwdUser, pwd)} />
    </Box>
  );
}
