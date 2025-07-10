import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PasswordField from '../../components/common/PasswordField';
import { authService } from '../../services/authService';

const ProfileForm = ({ user, onCancel, onSuccess }) => {
  const [form, setForm] = useState({
    email: user?.email || '',
    fullName: user?.fullName || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    // Check if email is provided and valid
    if (!form.email.trim()) {
      return 'Email is required';
    }
    
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return 'Please enter a valid email address';
    }

    // Password validation
    if (form.newPassword || form.currentPassword || form.confirmPassword) {
      if (!form.currentPassword) {
        return 'Current password is required to change password';
      }
      
      if (!form.newPassword) {
        return 'New password is required when changing password';
      }
      
      if (form.newPassword.length < 6) {
        return 'New password must be at least 6 characters long';
      }
      
      if (form.newPassword !== form.confirmPassword) {
        return 'New password and confirm password do not match';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Prepare update data
      const updateData = {
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        // Only include password if it's being changed
        ...(form.newPassword && {
          password: form.newPassword
        })
      };

      console.log('Updating profile for user:', user.userId);
      console.log('Update data:', { ...updateData, password: updateData.password ? '[HIDDEN]' : undefined });

      // Call the API to update profile
      const result = await authService.updateProfile(user.userId, updateData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        
        // Wait a moment to show success message
        setTimeout(() => {
          // Pass the updated data to parent
          onSuccess({
            email: form.email.trim(),
            fullName: form.fullName.trim()
          });
        }, 1000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An unexpected error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    onCancel();
  };

  const isFormChanged = () => {
    return (
      form.email !== (user?.email || '') ||
      form.fullName !== (user?.fullName || '') ||
      form.newPassword ||
      form.currentPassword ||
      form.confirmPassword
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Edit Profile</Typography>
        <IconButton onClick={handleCancel} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success">
              {success}
            </Alert>
          )}

          <Typography variant="h6" color="text.secondary">
            Basic Information
          </Typography>

          <TextField
            name="email"
            label="Email Address"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            helperText="This is your login email address"
          />

          <TextField
            name="fullName"
            label="Full Name"
            value={form.fullName}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            helperText="Your display name"
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" color="text.secondary">
            Change Password
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Leave password fields empty if you don't want to change your password
          </Typography>

          <PasswordField
            name="currentPassword"
            label="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            helperText="Required only if changing password"
          />

          <PasswordField
            name="newPassword"
            label="New Password"
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            helperText="Must be at least 6 characters"
          />

          <PasswordField
            name="confirmPassword"
            label="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            helperText="Must match the new password"
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              disabled={loading}
              size="large"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !isFormChanged()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              size="large"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default ProfileForm;