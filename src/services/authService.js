// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7060/api';

// Create axios instance with base configuration
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.post('https://localhost:7060/api/User/login', {
        userId: credentials.userId,
        username: credentials.username || credentials.email,
        password: credentials.password
      });
      
      const { token, userId, role, username, expiry } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        userId,
        username,
        role,
        expiry
      }));
      
      return {
        success: true,
        data: {
          token,
          user: {
            userId,
            username,
            role,
            expiry
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await authAPI.post('https://localhost:7060/api/User/register', userData);
      
      return {
        success: true,
        message: response.data.message || 'User registered successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Check if token is expired
        if (user.expiry && new Date(user.expiry) <= new Date()) {
          this.logout();
          return null;
        }
        return user;
      } catch (error) {
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const response = await authAPI.get(`https://localhost:7060/api/User/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  },

  // Update user profile
  async updateProfile(userId, userData) {
    try {
      const response = await authAPI.put(`https://localhost:7060/api/User/${userId}`, userData);
      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  }
};