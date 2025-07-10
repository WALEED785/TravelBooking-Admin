// src/utils/auth.js
import { authService } from '../services/authService';

// Check if user is authenticated
export const isAuthenticated = () => {
  return authService.isAuthenticated();
};

// Get current user
export const getCurrentUser = () => {
  return authService.getCurrentUser();
};

// Get auth token
export const getAuthToken = () => {
  return authService.getToken();
};

// Logout user
export const logout = () => {
  authService.logout();
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Check if user is admin
export const isAdmin = () => {
  return hasRole('Admin');
};

// Check if user is regular user
export const isUser = () => {
  return hasRole('User');
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Check if token is expired
export const isTokenExpired = () => {
  const user = getCurrentUser();
  if (!user || !user.expiry) return true;
  
  return new Date(user.expiry) <= new Date();
};

// Format user display name
export const getUserDisplayName = () => {
  const user = getCurrentUser();
  return user?.username || 'Guest';
};

// Legacy mock functions (for backward compatibility)
export const mockLogin = (credentials) => {
  // This is now handled by authService
  console.warn('mockLogin is deprecated. Use authService.login instead.');
  return null;
};

export const mockRegister = (userData) => {
  // This is now handled by authService
  console.warn('mockRegister is deprecated. Use authService.register instead.');
  return null;
};