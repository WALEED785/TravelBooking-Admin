import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const ErrorMessage = ({ 
  error, 
  title = 'Error', 
  onRetry,
  showRetry = true 
}) => {
  return (
    <Alert 
      severity="error" 
      sx={{ mb: 2 }}
      action={
        showRetry && onRetry && (
          <Button 
            color="inherit" 
            size="small" 
            onClick={onRetry}
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {error}
    </Alert>
  );
};

export default ErrorMessage;
