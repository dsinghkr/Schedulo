import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RoomIcon from '@mui/icons-material/Room';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

function CustomerFormDialog({ open, onClose, onSave, customer }) {
  const [form, setForm] = useState(customer || { name: '', address: '', googleMapLocation: '', contactPersonName: '', phoneNumber: '', alternateNumber: '' });
  const [error, setError] = useState('');
  useEffect(() => { setForm(customer || { name: '', address: '', googleMapLocation: '', contactPersonName: '', phoneNumber: '', alternateNumber: '' }); setError(''); }, [customer]);
  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onClose();
  };
  const handleSave = () => {
    if (!form.name || !form.address || !form.contactPersonName || !form.phoneNumber) {
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
      title={customer ? 'Edit Customer' : 'Add Customer'}
      actions={[
        <Button key="cancel" onClick={onClose} sx={buttonSx}>Cancel</Button>,
        <Button key="save" onClick={handleSave} variant="contained" sx={primaryButtonSx}>Save</Button>
      ]}
    >
      <FormRow label="Name" required>
        <TextField fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </FormRow>
      <FormRow label="Address" required>
        <TextField fullWidth value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      </FormRow>
      <FormRow label="Google Map Location">
        <TextField fullWidth value={form.googleMapLocation} onChange={e => setForm({ ...form, googleMapLocation: e.target.value })} />
      </FormRow>
      <FormRow label="Contact Person Name" required>
        <TextField fullWidth value={form.contactPersonName} onChange={e => setForm({ ...form, contactPersonName: e.target.value })} />
      </FormRow>
      <FormRow label="Phone Number" required>
        <TextField fullWidth value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
      </FormRow>
      <FormRow label="Alternate Number">
        <TextField fullWidth value={form.alternateNumber} onChange={e => setForm({ ...form, alternateNumber: e.target.value })} />
      </FormRow>
      {error && <Box color="red" mt={1}>{error}</Box>}
    </FormDialog>
  );
}

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [importSummary, setImportSummary] = useState(null);
  const [importError, setImportError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, customer: null });
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/customers');
      setCustomers(res.data);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      }
    }
    setLoading(false);
  };
  useEffect(() => { fetchCustomers(); }, []);

  const handleSave = async (form) => {
    try {
      if (editCustomer) {
        await axios.put(`/api/customers/${editCustomer.id}`, form);
      } else {
        await axios.post('/api/customers', form);
      }
      setDialogOpen(false);
      setEditCustomer(null);
      fetchCustomers();
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      }
    }
  };

  const handleDelete = async (customer) => {
    setDeleteDialog({ open: true, customer });
  };

  const confirmDelete = async () => {
    if (deleteDialog.customer) {
      try {
        await axios.delete(`/api/customers/${deleteDialog.customer.id}`);
        fetchCustomers();
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
        }
      }
    }
    setDeleteDialog({ open: false, customer: null });
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setImportError(null);
    setImportSummary(null);
    try {
      const res = await axios.post('/api/import/customers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImportSummary(res.data);
      fetchCustomers();
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      } else if (err.response && err.response.data && err.response.data.message) {
        setImportError(err.response.data.message);
      } else {
        setImportError('Import failed.');
      }
    }
    fileInputRef.current.value = '';
  };

  const handleExport = () => {
    window.open('/api/reports/export-customers-excel', '_blank');
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Customers</Typography>
        <Tooltip title="Add Customer">
          <IconButton color="primary" onClick={() => { setEditCustomer(null); setDialogOpen(true); }} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.17)', background: '#fff', color: '#2355a0', '&:hover': { background: '#e3e6ee' } }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {importError && <Alert severity="error" sx={{ mb: 2 }}>{importError}</Alert>}
      {importSummary && (
        <Dialog open={!!importSummary} onClose={() => setImportSummary(null)}>
          <DialogTitle>Import Summary</DialogTitle>
          <DialogContent>
            <Typography>{importSummary.message}</Typography>
            {importSummary.errors && importSummary.errors.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2">Errors:</Typography>
                <ul>
                  {importSummary.errors.map((err, idx) => (
                    <li key={idx}>Row {err.row}: {err.error}</li>
                  ))}
                </ul>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImportSummary(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Map</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow> : customers.map(customer => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.contactPersonName}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>
                  <Tooltip title={customer.googleMapLocation ? "Open in Google Maps" : "No location"}>
                    <span>
                      <IconButton
                        color={customer.googleMapLocation ? "primary" : "default"}
                        component={customer.googleMapLocation ? 'a' : 'span'}
                        href={customer.googleMapLocation || undefined}
                        target="_blank"
                        rel="noopener"
                        disabled={!customer.googleMapLocation}
                        sx={{ opacity: customer.googleMapLocation ? 1 : 0.4 }}
                      >
                        <RoomIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => { setEditCustomer(customer); setDialogOpen(true); }} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)', background: '#fff', color: '#2355a0', mr: 1, '&:hover': { background: '#e3e6ee' } }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(customer)} sx={{ borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)', background: '#fff', color: '#d32f2f', '&:hover': { background: '#fdecea' } }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomerFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} customer={editCustomer} />
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, customer: null })}>
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>Are you sure you want to delete the customer "{deleteDialog.customer?.name}"?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, customer: null })} sx={buttonSx}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
