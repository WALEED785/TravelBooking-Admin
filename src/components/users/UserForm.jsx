import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useUser } from '../../hooks/useUser';

const UserForm = ({ user, onSuccess, onCancel }) => {
  const { createUser, updateUser, loading } = useUser();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'User'
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Determine if this is an edit operation
  const isEdit = !!user;
  
  // Initialize form data
  useEffect(() => {
    if (isEdit && user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Always empty for security
        fullName: user.fullName || '',
        role: user.role || 'User'
      });
    } else {
      // Reset form for new user
      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: 'User'
      });
    }
    
    // Clear errors and messages
    setErrors({});
    setTouched({});
    setFormError('');
    setFormSuccess('');
  }, [user, isEdit]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear form-level error
    if (formError) {
      setFormError('');
    }
  };
  
  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur
    validateField(name, formData[name]);
  };
  
  // Validate individual field
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'username':
        if (!isEdit) { // Username required only for create
          if (!value || value.trim().length < 3) {
            error = 'Username must be at least 3 characters long';
          }
        }
        break;
        
      case 'email':
        if (!value || !value.trim()) {
          error = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!isEdit) { // Password required only for create
          if (!value || value.length < 6) {
            error = 'Password must be at least 6 characters long';
          }
        } else if (value && value.length < 6) {
          error = 'Password must be at least 6 characters long';
        }
        break;
        
      case 'role':
        if (value && !['User', 'Admin'].includes(value)) {
          error = 'Role must be either User or Admin';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return error === '';
  };
  
  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate each field
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate form
    if (!validateForm()) {
      setFormError('Please fix the errors above');
      return;
    }
    
    try {
      let result;
      
      if (isEdit) {
        // Update user
        const updateData = { ...formData };
        
        // Remove password if empty (don't update password)
        if (!updateData.password) {
          delete updateData.password;
        }
        
        // Remove username from update data (usually not updateable)
        delete updateData.username;
        
        result = await updateUser(user.userId, updateData);
      } else {
        // Create new user
        result = await createUser(formData);
      }
      
      if (result.success) {
        setFormSuccess(result.message || `User ${isEdit ? 'updated' : 'created'} successfully`);
        
        // Call success callback after a brief delay to show success message
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setFormError(result.error || `Failed to ${isEdit ? 'update' : 'create'} user`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError('An unexpected error occurred. Please try again.');
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    onCancel();
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* Form Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? 'Edit User Information' : 'Create New User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit 
            ? 'Update the user information below. Leave password empty to keep current password.'
            : 'Fill in the information below to create a new user account.'
          }
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Error/Success Messages */}
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      
      {formSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {formSuccess}
        </Alert>
      )}
      
      {/* Form Fields */}
      <Grid container spacing={3}>
        {/* Username - Only for create */}
        {!isEdit && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}
        
        {/* Email */}
        <Grid item xs={12} md={isEdit ? 12 : 6}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            required
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        {/* Full Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fullName && !!errors.fullName}
            helperText={touched.fullName && errors.fullName}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        {/* Role */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
              disabled={loading}
              startAdornment={
                <InputAdornment position="start">
                  <AdminIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Password */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="password"
            label={isEdit ? "New Password (leave empty to keep current)" : "Password"}
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            required={!isEdit}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          startIcon={<CancelIcon />}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading 
            ? (isEdit ? 'Updating...' : 'Creating...')
            : (isEdit ? 'Update User' : 'Create User')
          }
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;