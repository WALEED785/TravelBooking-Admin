// src/pages/Auth/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert,
  CircularProgress,
  Link,
  MenuItem
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "User"
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register, loading, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
    
    // Clear auth error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.username.trim()) {
      errors.username = 'Username is required';
    } else if (form.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!form.fullName.trim()) {
      errors.fullName = 'Full name is required';
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
      const result = await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        role: form.role
      });

      if (result.success) {
        setSuccess(true);
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
      // Error handling is done in useAuth hook
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  if (success) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 2
        }}
      >
        <Paper 
          elevation={8}
          sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            Registration Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Your account has been created successfully. 
            You will be redirected to the login page shortly.
          </Typography>
          <CircularProgress />
        </Paper>
      </Box>
    );
  }

  return (
    <Box 
      minHeight="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Paper 
        elevation={8}
        sx={{ 
          p: 4, 
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          textAlign="center"
          color="primary"
          fontWeight="bold"
        >
          Create Account
        </Typography>
        
        <Typography 
          variant="body2" 
          textAlign="center" 
          color="text.secondary"
          mb={3}
        >
          Join us today
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.username}
            helperText={validationErrors.username}
            disabled={loading}
            autoComplete="username"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            disabled={loading}
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.fullName}
            helperText={validationErrors.fullName}
            disabled={loading}
            autoComplete="name"
          />

          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            disabled={loading}
            autoComplete="new-password"
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!validationErrors.confirmPassword}
            helperText={validationErrors.confirmPassword}
            disabled={loading}
            autoComplete="new-password"
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2,
              height: 48,
              fontSize: '1.1rem'
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/auth/login"
              color="primary"
              sx={{ textDecoration: 'none' }}
            >
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;