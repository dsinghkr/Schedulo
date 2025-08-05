import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Button, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

function getIndianFinancialYear() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  if (month >= 4) {
    // FY starts in April
    return `${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    return `${year - 1}-${year.toString().slice(-2)}`;
  }
}

function CategoryFormDialog({ open, onClose, onSave, category }) {
  const [form, setForm] = useState(category || { name: '', description: '', year: getIndianFinancialYear() });
  useEffect(() => {
    setForm(category || { name: '', description: '', year: getIndianFinancialYear() });
  }, [category]);
  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onClose();
  };
  return (
    <FormDialog
      open={open}
      onClose={handleDialogClose}
      title={category ? 'Edit Category' : 'Add Category'}
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
      <FormRow label="Year">
        <TextField fullWidth value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
      </FormRow>
    </FormDialog>
  );
}

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await axios.get('/api/categories');
    setCategories(res.data);
    setLoading(false);
  };
  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async (form) => {
    if (editCategory) {
      await axios.put(`/api/categories/${editCategory.id}`, form);
    } else {
      await axios.post('/api/categories', form);
    }
    setDialogOpen(false);
    setEditCategory(null);
    fetchCategories();
  };

  const handleDelete = async (category) => {
    if (window.confirm('Delete this category?')) {
      await axios.delete(`/api/categories/${category.id}`);
      fetchCategories();
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Categories</Typography>
        <Tooltip title="Add Category"><IconButton color="primary" onClick={() => { setEditCategory(null); setDialogOpen(true); }}><AddIcon /></IconButton></Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Year</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow> : categories.map(category => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.year || ''}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit"><IconButton color="primary" onClick={() => { setEditCategory(category); setDialogOpen(true); }}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(category)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CategoryFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} category={editCategory} />
    </Box>
  );
}
