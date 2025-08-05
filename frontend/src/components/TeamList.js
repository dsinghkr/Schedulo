import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import axios from 'axios';
import FormDialog from './FormDialog';
import FormRow from './FormRow';

const memberRoles = ['User', 'Asst-Manager', 'Manager'];

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
  fontWeight: 600,
  '&.Mui-disabled': {
    background: 'linear-gradient(90deg, #4f8cff 0%, #2355a0 100%)',
    color: '#fff',
    opacity: 0.5
  }
};

function TeamFormDialog({ open, onClose, onSave, team }) {
  const [form, setForm] = useState(team || { name: '', description: '' });
  useEffect(() => { setForm(team || { name: '', description: '' }); }, [team]);
  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onClose();
  };
  return (
    <FormDialog
      open={open}
      onClose={handleDialogClose}
      title={team ? 'Edit Team' : 'Add Team'}
      actions={[
        <Button key="cancel" onClick={onClose} sx={buttonSx}>Cancel</Button>,
        <Button key="save" onClick={() => onSave(form)} variant="contained" sx={primaryButtonSx}>Save</Button>
      ]}
    >
      <FormRow label="Name" required>
        <TextField fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </FormRow>
      <FormRow label="Description">
        <TextField fullWidth value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </FormRow>
    </FormDialog>
  );
}

function TeamMembersDialog({ open, onClose, team, refresh }) {
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('User');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      axios.get('/api/users').then(res => {
        setUsers(res.data.filter(u => !u.deleted));
        setMembers(res.data.filter(u => u.teamId === team.id && !u.deleted));
      });
    }
  }, [open, team]);

  const hasManager = members.some(m => m.role === 'Manager');
  const hasAsstManager = members.some(m => m.role === 'Asst-Manager');
  const allowedRoles = memberRoles.filter(role => {
    if (role === 'Manager' && hasManager) return false;
    if (role === 'Asst-Manager' && hasAsstManager) return false;
    return true;
  });
  const selectedUserObj = users.find(u => u.id === selectedUser);
  const displayRole = selectedUserObj ? selectedUserObj.role : selectedRole;

  const handleAssign = async () => {
    setError('');
    try {
      await axios.post('/api/users/assign-to-team', {
        userId: selectedUser,
        teamId: team.id,
        role: displayRole
      });
      setSelectedUser('');
      setSelectedRole('User');
      const res = await axios.get('/api/users');
      setMembers(res.data.filter(u => u.teamId === team.id && !u.deleted));
      if (refresh) refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning user');
    }
  };

  const handleRemove = async (userId) => {
    await axios.put(`/api/users/${userId}`, { teamId: null });
    const res = await axios.get('/api/users');
    setMembers(res.data.filter(u => u.teamId === team.id && !u.deleted));
    if (refresh) refresh();
  };

  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onClose();
  };

  return (
    <FormDialog
      open={open}
      onClose={handleDialogClose}
      title={`Manage Members for ${team?.name}`}
      actions={[<Button key="close" onClick={onClose} sx={buttonSx}>Close</Button>]}
    >
      <Typography variant="subtitle1" mb={2}>Assign User to Team</Typography>
      <Box mb={2}>
        <FormRow label="User" required controlWidth={260}>
          <TextField select value={selectedUser} onChange={e => {
            setSelectedUser(e.target.value);
            const userObj = users.find(u => u.id === e.target.value);
            setSelectedRole(userObj ? userObj.role : 'User');
          }} sx={{ width: 260 }}>
            {users.filter(u => !u.teamId || u.teamId === team.id).map(u => (
              <MenuItem key={u.id} value={u.id}>{u.name} ({u.role})</MenuItem>
            ))}
          </TextField>
        </FormRow>
        <FormRow label="Role" required controlWidth={260}>
          <TextField select value={displayRole} onChange={e => setSelectedRole(e.target.value)} sx={{ width: 260 }}>
            {allowedRoles.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
        </FormRow>
        <Box mt={2}>
          <Button variant="contained" onClick={handleAssign} disabled={!selectedUser || (displayRole === 'Manager' && hasManager) || (displayRole === 'Asst-Manager' && hasAsstManager)} sx={primaryButtonSx}>Assign</Button>
        </Box>
        {error && <Typography color="error" mt={1}>{error}</Typography>}
      </Box>
      <Typography variant="subtitle1">Current Members</Typography>
      <Table size="small" sx={{ minWidth: 350 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map(m => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.role}</TableCell>
              <TableCell align="right">
                <Button color="error" onClick={() => handleRemove(m.id)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormDialog>
  );
}

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [membersDialog, setMembersDialog] = useState({ open: false, team: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, team: null });

  const fetchTeams = async () => {
    setLoading(true);
    const res = await axios.get('/api/teams');
    setTeams(res.data);
    setLoading(false);
  };
  useEffect(() => { fetchTeams(); }, []);

  const handleSave = async (form) => {
    if (editTeam) {
      await axios.put(`/api/teams/${editTeam.id}`, form);
    } else {
      await axios.post('/api/teams', form);
    }
    setDialogOpen(false);
    setEditTeam(null);
    fetchTeams();
  };

  const handleDelete = async (team) => {
    setDeleteDialog({ open: true, team });
  };

  const confirmDelete = async () => {
    if (deleteDialog.team) {
      await axios.delete(`/api/teams/${deleteDialog.team.id}`);
      fetchTeams();
    }
    setDeleteDialog({ open: false, team: null });
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Teams</Typography>
        <Tooltip title="Add Team">
          <IconButton color="primary" onClick={() => { setEditTeam(null); setDialogOpen(true); }} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)', background: '#fff', color: '#2355a0', '&:hover': { background: '#e3e6ee' } }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> : teams.map(team => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.description}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Manage Members">
                    <IconButton color="primary" onClick={() => setMembersDialog({ open: true, team })} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)', background: '#fff', color: '#2355a0', mr: 1, '&:hover': { background: '#e3e6ee' } }}>
                      <GroupIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => { setEditTeam(team); setDialogOpen(true); }} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)', background: '#fff', color: '#2355a0', mr: 1, '&:hover': { background: '#e3e6ee' } }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(team)} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)', background: '#fff', color: '#d32f2f', '&:hover': { background: '#fdecea' } }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TeamFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} team={editTeam} />
      {membersDialog.open && (
        <TeamMembersDialog
          open={membersDialog.open}
          onClose={() => setMembersDialog({ open: false, team: null })}
          team={membersDialog.team}
          refresh={fetchTeams}
        />
      )}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, team: null })}>
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>Are you sure you want to delete the team "{deleteDialog.team?.name}"?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, team: null })} sx={buttonSx}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
