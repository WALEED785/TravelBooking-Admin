// src/components/destinations/DestinationForm.jsx
import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDestinationMutation } from '../../hooks/useDestinations';

const DestinationForm = ({ open, onClose, destination }) => {
  const isEditMode = Boolean(destination);
  const { 
    loading, 
    error, 
    success, 
    resetState,
    createNewDestination, 
    updateExistingDestination 
  } = useDestinationMutation();

  const [formData, setFormData] = React.useState({
    name: '',
    country: '',
    description: ''
  });

  const [validationErrors, setValidationErrors] = React.useState({});

  // Reset form when destination changes or dialog opens/closes
  React.useEffect(() => {
    if (open) {
      if (destination) {
        setFormData({
          name: destination.name || '',
          country: destination.country || '',
          description: destination.description || ''
        });
      } else {
        setFormData({
          name: '',
          country: '',
          description: ''
        });
      }
      setValidationErrors({});
      resetState();
    }
  }, [destination, open, resetState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Destination name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Destination name must be 100 characters or less';
    }
    
    if (!formData.country?.trim()) {
      errors.country = 'Country is required';
    } else if (formData.country.length > 50) {
      errors.country = 'Country must be 50 characters or less';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be 500 characters or less';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const submitData = {
        name: formData.name.trim(),
        country: formData.country.trim(),
        description: formData.description.trim() || null
      };

      if (isEditMode) {
        await updateExistingDestination(destination.destinationId, submitData);
      } else {
        await createNewDestination(submitData);
      }
      
      // Close dialog after short delay to show success message
      setTimeout(() => {
        onClose(true); // true indicates successful operation
      }, 1500);
    } catch (err) {
      console.error('Error submitting destination:', err);
      // Error is handled by the hook
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose(false);
    }
  };

  const isFormValid = formData.name?.trim() && formData.country?.trim();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditMode ? 'Edit Destination' : 'Create New Destination'}
          </Typography>
          <IconButton 
            onClick={handleClose} 
            disabled={loading}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => resetState()}>
                <Typography variant="body2">
                  <strong>Error:</strong> {error.message || 'An error occurred'}
                </Typography>
                {error.status && (
                  <Typography variant="caption" display="block">
                    Status: {error.status}
                  </Typography>
                )}
                {error.details && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block">
                      Details: {JSON.stringify(error.details, null, 2)}
                    </Typography>
                  </Box>
                )}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success">
                <Typography variant="body2">
                  {isEditMode 
                    ? 'Destination updated successfully!' 
                    : 'Destination created successfully!'}
                </Typography>
              </Alert>
            )}

            <TextField
              name="name"
              label="Destination Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              error={!!validationErrors.name}
              helperText={validationErrors.name || `${formData.name.length}/100 characters`}
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              error={!!validationErrors.country}
              helperText={validationErrors.country || `${formData.country.length}/50 characters`}
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              name="description"
              label="Description (Optional)"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              disabled={loading}
              error={!!validationErrors.description}
              helperText={validationErrors.description || `${formData.description.length}/500 characters`}
              inputProps={{ maxLength: 500 }}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !isFormValid}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditMode ? (
              'Update Destination'
            ) : (
              'Create Destination'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DestinationForm;