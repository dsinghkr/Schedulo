import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  TextField,
  Tooltip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Help as HelpIcon,
  SwapHoriz as SwapHorizIcon,
  PlayArrow as PlayArrowIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from './FormDialog';
import FormRow from './FormRow';
import AddIcon from '@mui/icons-material/Add';

const statusColors = {
  pending: 'default',
  'in-progress': 'primary',
  'stage-complete': 'success',
  escalated: 'error',
  complete: 'success',
  returned: 'warning'
};

function DualListCustomerSelector({ customers, selectedCustomers, setSelectedCustomers }) {
  const [left, setLeft] = useState([]); // available
  const [right, setRight] = useState([]); // selected
  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);
  const [searchLeft, setSearchLeft] = useState('');
  const [searchRight, setSearchRight] = useState('');

  useEffect(() => {
    setLeft(customers.filter(c => !selectedCustomers.some(sel => sel.id === c.id)));
    setRight(selectedCustomers);
  }, [customers, selectedCustomers]);

  const handleLeftSelect = (id) => {
    setLeftSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handleRightSelect = (id) => {
    setRightSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const moveRight = () => {
    const toMove = left.filter(c => leftSelected.includes(c.id));
    setSelectedCustomers([...right, ...toMove]);
    setLeftSelected([]);
  };
  const moveLeft = () => {
    const toMove = right.filter(c => rightSelected.includes(c.id));
    setSelectedCustomers(right.filter(r => !rightSelected.includes(r.id)));
    setRightSelected([]);
  };

  const filteredLeft = left.filter(c => c.name.toLowerCase().includes(searchLeft.toLowerCase()) || c.address.toLowerCase().includes(searchLeft.toLowerCase()));
  const filteredRight = right.filter(c => c.name.toLowerCase().includes(searchRight.toLowerCase()) || c.address.toLowerCase().includes(searchRight.toLowerCase()));

  return (
    <Box display="flex" gap={3} alignItems="flex-start">
      <Box>
        <Typography fontWeight={600} fontSize={14} mb={1}>Available Customers:</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          value={searchLeft}
          onChange={e => setSearchLeft(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Paper variant="outlined" sx={{ width: 220, height: 220, overflow: 'auto' }}>
          <List dense>
            {filteredLeft.map(customer => (
              <ListItem
                key={customer.id}
                button
                selected={leftSelected.includes(customer.id)}
                onClick={() => handleLeftSelect(customer.id)}
                sx={{ px: 1 }}
              >
                <ListItemText primary={customer.name} secondary={customer.address} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} mt={4}>
        <Button variant="contained" onClick={moveRight} disabled={leftSelected.length === 0} sx={{ minWidth: 90 }}>Add -&gt;</Button>
        <Button variant="contained" onClick={moveLeft} disabled={rightSelected.length === 0} sx={{ minWidth: 90 }}> &lt;- Remove</Button>
      </Box>
      <Box>
        <Typography fontWeight={600} fontSize={14} mb={1}>Selected Customers:</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          value={searchRight}
          onChange={e => setSearchRight(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Paper variant="outlined" sx={{ width: 220, height: 220, overflow: 'auto' }}>
          <List dense>
            {filteredRight.map(customer => (
              <ListItem
                key={customer.id}
                button
                selected={rightSelected.includes(customer.id)}
                onClick={() => handleRightSelect(customer.id)}
                sx={{ px: 1 }}
              >
                <ListItemText primary={customer.name} secondary={customer.address} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
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
  color: '#fff !important', // force white text
  fontWeight: 600,
  '&.Mui-disabled': {
    background: 'linear-gradient(90deg, #4f8cff 0%, #2355a0 100%)',
    color: '#fff',
    opacity: 0.5
  }
};

function AssignmentForm({ user, onSave, editAssignment, onCancelEdit }) {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [teamsRes, tasksRes, customersRes] = await Promise.all([
          axios.get('/api/teams'),
          axios.get('/api/tasks'),
          axios.get('/api/customers')
        ]);
        setTeams(teamsRes.data);
        setTasks(tasksRes.data);
        setCustomers(customersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedTeam) {
        const res = await axios.get(`/api/teams/${selectedTeam}/users`);
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [selectedTeam]);

  useEffect(() => {
    if (editAssignment) {
      setSelectedTeam(editAssignment.teamId || '');
      setSelectedUser(editAssignment.userId || '');
      setSelectedTask(editAssignment.taskId || '');
      setSelectedCustomers(editAssignment.customer ? [editAssignment.customer] : []);
    } else {
      setSelectedTeam('');
      setSelectedUser('');
      setSelectedTask('');
      setSelectedCustomers([]);
    }
  }, [editAssignment]);

  const handleSave = () => {
    if (!selectedTeam || !selectedUser || !selectedTask || selectedCustomers.length === 0) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    onSave({
      id: editAssignment?.id,
      userId: selectedUser,
      taskId: selectedTask,
      customerIds: selectedCustomers.map(c => c.id),
      teamId: selectedTeam
    });
    // Reset form
    if (!editAssignment) {
      setSelectedUser('');
      setSelectedTask('');
      setSelectedCustomers([]);
    }
  };

  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onCancelEdit();
  };

  if (loading) return <Box>Loading...</Box>;

  return (
    <FormDialog
      open={!!editAssignment}
      onClose={handleDialogClose}
      title={editAssignment ? 'Edit Assignment' : 'Assign Tasks / Subtasks'}
      actions={[
        <Button key="cancel" onClick={onCancelEdit} sx={buttonSx}>Cancel</Button>,
        <Button key="save" variant="contained" onClick={handleSave} disabled={!selectedUser || !selectedTask || selectedCustomers.length === 0 || users.length === 0} sx={primaryButtonSx}>{editAssignment ? 'Update' : 'Assign'}</Button>
      ]}
    >
      <Grid container spacing={2} mb={2}>
        <Grid item xs={6}>
          <FormRow label="Task" required>
            <TextField select fullWidth value={selectedTask} onChange={e => setSelectedTask(e.target.value)}>
              {tasks.map(task => (
                <MenuItem key={task.id} value={task.id}>{task.name}</MenuItem>
              ))}
            </TextField>
          </FormRow>
        </Grid>
        <Grid item xs={6}>
          <FormRow label="Team" required>
            <TextField select fullWidth value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
              {teams.map(team => (
                <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
              ))}
            </TextField>
          </FormRow>
        </Grid>
      </Grid>
      <FormRow label="Customer(s)" required>
        <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2, background: '#fafbfc' }}>
          <DualListCustomerSelector
            customers={customers}
            selectedCustomers={selectedCustomers}
            setSelectedCustomers={setSelectedCustomers}
          />
        </Box>
      </FormRow>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={4}>
          <FormRow label="User" required>
            <TextField select fullWidth value={selectedUser} onChange={e => setSelectedUser(e.target.value)} disabled={!selectedTeam || users.length === 0}>
              {users.length === 0 ? (
                <MenuItem value="" disabled>
                  No team members found for this team
                </MenuItem>
              ) : (
                users.map(user => (
                  <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                ))
              )}
            </TextField>
          </FormRow>
        </Grid>
        <Grid item xs={4}>
          <FormRow label="Status" required>
            <TextField select fullWidth value={editAssignment?.status || 'pending'} disabled>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="stage-complete">Stage Complete</MenuItem>
              <MenuItem value="escalated">Escalated</MenuItem>
              <MenuItem value="returned">Returned</MenuItem>
            </TextField>
          </FormRow>
        </Grid>
        <Grid item xs={4}>
          <FormRow label="Due Date" required>
            <TextField type="date" fullWidth value={editAssignment?.dueDate || ''} InputLabelProps={{ shrink: true }} disabled />
          </FormRow>
        </Grid>
      </Grid>
      {error && <Box color="red" mb={2}>{error}</Box>}
    </FormDialog>
  );
}

function AssignmentDetailsDialog({ open, onClose, assignment, user }) {
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (assignment) {
      fetchComments();
      fetchAttachments();
    }
    // eslint-disable-next-line
  }, [assignment]);

  const fetchComments = async () => {
    if (!assignment) return;
    const res = await axios.get(`/api/task-comments/${assignment.taskId}`);
    setComments(res.data);
  };

  const fetchAttachments = async () => {
    if (!assignment) return;
    const res = await axios.get(`/api/task-attachments?taskId=${assignment.taskId}`);
    setAttachments(res.data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await axios.post(`/api/task-comments/${assignment.taskId}`, {
      userId: user.id,
      comment: newComment
    });
    setNewComment('');
    fetchComments();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', assignment.taskId);
    formData.append('uploadedBy', user.id);
    await axios.post('/api/task-attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setFile(null);
    setUploading(false);
    fetchAttachments();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Assignment Details</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="subtitle2"><b>User:</b> {assignment?.user?.name}</Typography>
              <Typography variant="subtitle2"><b>Customer:</b> {assignment?.customer?.name}</Typography>
              <Typography variant="subtitle2"><b>Status:</b> {assignment?.status}</Typography>
              <Typography variant="subtitle2"><b>Due Date:</b> {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : ''}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="subtitle2" mb={1}><b>Attachments</b></Typography>
              <Box>
                {attachments.length === 0 && <Typography color="text.secondary" fontSize={14}>No files uploaded yet.</Typography>}
                {attachments.map(att => (
                  <Box key={att.id} display="flex" alignItems="center" gap={1}>
                    <AttachFileIcon fontSize="small" />
                    <a href={`/api/task-attachments/${att.id}/download`} target="_blank" rel="noopener noreferrer">{att.originalName}</a>
                    <Typography variant="caption" color="text.secondary">({Math.round(att.size/1024)} KB)</Typography>
                  </Box>
                ))}
              </Box>
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <Button variant="outlined" component="label" disabled={uploading} size="small">
                  Upload File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {file && <span>{file.name}</span>}
                <Button onClick={handleUpload} variant="contained" disabled={!file || uploading} size="small">Upload</Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="subtitle2" mb={1}><b>Work Log / Comments</b></Typography>
          <Paper variant="outlined" sx={{ minHeight: 120, maxHeight: 200, overflowY: 'auto', mb: 1, p: 1 }}>
            {comments.length === 0 ? (
              <Typography color="text.secondary" fontSize={14}>No comments yet.</Typography>
            ) : (
              comments.map((c) => (
                <Box key={c.id} mb={1}>
                  <b>{c.user?.name || 'User'}:</b> {c.comment}
                  <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">{new Date(c.createdAt).toLocaleString()}</Typography>
                </Box>
              ))
            )}  //DONOT CHANGE this line irrespective of bracket balancing 
          </Paper>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
            />
            <Button onClick={handleAddComment} variant="contained">Add</Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function AssignmentList({ user, assignments, onStatusChange, onEscalate, onShowDetails, onEdit, onDelete }) {
  const isManager = user.role === 'Manager' || user.role === 'Admin' || user.role === 'SuperAdmin';
  const [deleteId, setDeleteId] = useState(null);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow
              key={assignment.id}
              sx={{
                backgroundColor: assignment.status === 'escalated' ? '#ffebee' : 'inherit',
                cursor: 'pointer'
              }}
              onClick={() => onEdit(assignment)}
            >
              <TableCell>{assignment.task.name}</TableCell>
              <TableCell>{assignment.customer.name}</TableCell>
              <TableCell>{assignment.user.name}</TableCell>
              <TableCell>
                <Chip
                  label={assignment.status}
                  color={statusColors[assignment.status]}
                  size="small"
                />
              </TableCell>
              <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
              <TableCell align="right" onClick={e => e.stopPropagation()}>
                <Tooltip title="Details">
                  <IconButton onClick={() => onShowDetails(assignment)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => setDeleteId(assignment.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
                {isManager ? (
                  <>
                    {assignment.status === 'stage-complete' && (
                      <>
                        <Tooltip title="Mark Complete">
                          <IconButton onClick={() => onStatusChange(assignment.id, 'complete')}>
                            <CheckIcon color="success" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Return">
                          <IconButton onClick={() => onStatusChange(assignment.id, 'returned')}>
                            <CloseIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip title="Reassign">
                      <IconButton>
                        <SwapHorizIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    {assignment.status === 'pending' && (
                      <Tooltip title="Start Task">
                        <IconButton onClick={() => onStatusChange(assignment.id, 'in-progress')}>
                          <PlayArrowIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {assignment.status === 'in-progress' && (
                      <>
                        <Tooltip title="Mark Stage Complete">
                          <IconButton onClick={() => onStatusChange(assignment.id, 'stage-complete')}>
                            <CheckIcon color="success" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Request Help">
                          <IconButton onClick={() => onEscalate(assignment.id)}>
                            <HelpIcon color="warning" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </>
                )}
                {/* Delete confirmation dialog */}
                <Dialog open={deleteId === assignment.id} onClose={() => setDeleteId(null)}>
                  <DialogTitle>Delete Assignment</DialogTitle>
                  <DialogContent>Are you sure you want to delete this assignment?</DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button color="error" onClick={() => { onDelete(assignment.id); setDeleteId(null); }}>Delete</Button>
                  </DialogActions>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function TaskAssignment({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editAssignment, setEditAssignment] = useState(null);
  const isManager = user.role === 'Manager' || user.role === 'Admin' || user.role === 'SuperAdmin';

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const res = await axios.get(`/api/task-assignments${isManager ? '' : `/user/${user.id}`}`);
    setAssignments(res.data);
  };

  const handleCreateOrUpdateAssignments = async (data) => {
    if (data.id) {
      // Update assignment (for simplicity, only user, task, customer, team)
      await axios.put(`/api/task-assignments/${data.id}/reassign`, {
        userId: data.userId,
        teamId: data.teamId
      });
      // For customer/task change, you may need to delete and recreate
    } else {
      await axios.post('/api/task-assignments/batch', data);
    }
    setEditAssignment(null);
    fetchAssignments();
  };

  const handleDelete = async (assignmentId) => {
    await axios.put(`/api/task-assignments/${assignmentId}/status`, { status: 'deleted' });
    fetchAssignments();
  };

  const handleStatusChange = async (assignmentId, newStatus) => {
    await axios.put(`/api/task-assignments/${assignmentId}/status`, { status: newStatus });
    fetchAssignments();
  };

  const handleEscalate = async (assignmentId) => {
    await axios.post(`/api/task-assignments/${assignmentId}/escalate`);
    fetchAssignments();
  };

  const handleShowDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setDetailsOpen(true);
  };

  const handleEdit = (assignment) => {
    setEditAssignment(assignment);
  };

  const handleCancelEdit = () => {
    setEditAssignment(null);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} sx={{ background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)', boxShadow: '0 4px 16px 0 rgba(31,38,135,0.10)', borderRadius: 3, px: 2 }}>
        <Typography variant="h5">Task Assignments</Typography>
        {isManager && (
          <Tooltip title="Add Assignment">
            <IconButton color="primary" onClick={() => setEditAssignment({})} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)', background: '#fff', color: '#2355a0', height: 48, width: 48, '&:hover': { background: '#e3e6ee' } }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Typography variant="h6" gutterBottom>
        {isManager ? 'All Assignments' : 'My Assignments'}
      </Typography>
      <AssignmentList
        user={user}
        assignments={assignments}
        onStatusChange={handleStatusChange}
        onEscalate={handleEscalate}
        onShowDetails={handleShowDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AssignmentForm user={user} onSave={handleCreateOrUpdateAssignments} editAssignment={editAssignment} onCancelEdit={handleCancelEdit} />
      <AssignmentDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        assignment={selectedAssignment}
        user={user}
      />
    </Box>
  );
}