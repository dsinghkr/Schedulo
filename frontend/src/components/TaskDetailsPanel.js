import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
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

export default function TaskDetailsPanel({ task, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setLoading(true);
      axios.get(`/api/tasks/${task.id}`).then(res => {
        setDetails(res.data);
        setLoading(false);
      });
    }
  }, [task]);

  if (!task) return null;
  if (loading || !details) return <Typography>Loading task details...</Typography>;

  return (
    <FormDialog
      open={!!task}
      onClose={onClose}
      title="Task Details"
      actions={[<Button key="close" variant="contained" onClick={onClose} sx={primaryButtonSx}>Close</Button>]}
    >
      <FormRow label="Name">
        <Typography>{details.name}</Typography>
      </FormRow>
      <FormRow label="Status">
        <Typography>{details.status}</Typography>
      </FormRow>
      <FormRow label="Start Date">
        <Typography>{details.startDate?.slice(0, 10)}</Typography>
      </FormRow>
      <FormRow label="Due Date">
        <Typography>{details.dueDate?.slice(0, 10)}</Typography>
      </FormRow>
      <FormRow label="Category ID">
        <Typography>{details.categoryId}</Typography>
      </FormRow>
      <FormRow label="Assigned User ID">
        <Typography>{details.assignedUserId}</Typography>
      </FormRow>
    </FormDialog>
  );
}
