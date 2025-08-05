import React from 'react';
import { Dialog, Box, Typography, DialogContent, DialogActions } from '@mui/material';

export default function FormDialog({ open, onClose, title, children, actions, maxWidth = 'md', fullWidth = true, titleBarColor = 'linear-gradient(90deg, #2355a0 0%, #4f8cff 100%)', ...props }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} PaperProps={{ sx: { borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)', minHeight: 400 } }} {...props}>
      <Box sx={{ background: titleBarColor, px: 3, py: 2, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{title}</Typography>
      </Box>
      <DialogContent sx={{ py: 4 }}>
        {children}
      </DialogContent>
      {actions && <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
}
