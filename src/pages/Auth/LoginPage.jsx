// src/pages/Auth/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert,
  CircularProgress,
  Link
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [form, setForm] = useState({ 
    username: "", 
    password: "" 
  });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useAuth();

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
    }
    
    if (!form.password.trim()) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        username: form.username.trim(),
        password: form.password
      });

      if (result.success) {
        // Redirect to dashboard on successful login
        navigate("/dashboard");
      }
      // Error handling is done in useAuth hook
    } catch (err) {
      console.error('Login error:', err);
    }
  };

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
          Welcome Back
        </Typography>
        
        <Typography 
          variant="body2" 
          textAlign="center" 
          color="text.secondary"
          mb={3}
        >
          Sign in to your account
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
            autoComplete="current-password"
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
              'Sign In'
            )}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/auth/register"
              color="primary"
              sx={{ textDecoration: 'none' }}
            >
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;