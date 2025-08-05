import React from 'react';
import { Box, Typography } from '@mui/material';

export default function FormRow({ label, required, children, labelWidth = 120, controlWidth = 260, labelProps = {}, controlProps = {} }) {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Box sx={{ width: labelWidth, mr: 2, textAlign: 'right', color: '#2a3b4d', fontWeight: 500, flexShrink: 0 }} {...labelProps}>
        {label} {required && <span style={{color:'red'}}>*</span>}
      </Box>
      <Box sx={{ width: controlWidth }} {...controlProps}>
        {children}
      </Box>
    </Box>
  );
}
