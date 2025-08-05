import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';

export default function TaskList({ title, filter, pageSize = 5, onSelectTask }) {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/tasks', { params: { ...filter } })
      .then(res => {
        setTasks(res.data.slice((page - 1) * pageSize, page * pageSize));
        setTotal(res.data.length);
        setLoading(false);
      });
  }, [filter, page, pageSize]);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.categoryId}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.startDate?.slice(0, 10)}</TableCell>
                  <TableCell>{task.dueDate?.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => onSelectTask(task)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography>Page {page} of {Math.ceil(total / pageSize)}</Typography>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="outlined">Prev</Button>
        <Button disabled={page * pageSize >= total} onClick={() => setPage(page + 1)} variant="outlined">Next</Button>
      </Box>
    </Box>
  );
}
