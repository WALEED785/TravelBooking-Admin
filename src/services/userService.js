// src/services/userService.js
import api from '../utils/api';

export const userService = {
  // Get all users (Admin only)
  async getAllUsers() {
    try {
      const response = await api.get('https://localhost:7060/api/User');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.Message || error.message || 'Failed to fetch users'
      };
    }
  },

  // Get user by ID
  async getUserById(id) {
    try {
      const response = await api.get(`https://localhost:7060/api/User/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.Message || error.message || 'Failed to fetch user'
      };
    }
  },

  // Create new user (Admin only)
  async createUser(userData) {
    try {
      const response = await api.post('https://localhost:7060/api/User/register', userData);
      return {
        success: true,
        data: response.data,
        message: response.data.Message || 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.Message || error.message || 'Failed to create user'
      };
    }
  },

  // Update user (Admin only)
  async updateUser(id, userData) {
    try {
      const response = await api.put(`https://localhost:7060/api/User/${id}`, userData);
      return {
        success: true,
        message: 'User updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.Message || error.message || 'Failed to update user'
      };
    }
  },

  // Delete user (Admin only)
  async deleteUser(id) {
    try {
      await api.delete(`https://localhost:7060/api/User/${id}`);
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.Message || error.message || 'Failed to delete user'
      };
    }
  },

  // Validate user data
  validateUserData(userData, isUpdate = false) {
    const errors = {};

    // Username validation
    if (!isUpdate && (!userData.username || userData.username.trim().length < 3)) {
      errors.username = 'Username must be at least 3 characters long';
    }

    // Email validation
    if (!userData.email || !userData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation (only for create or when password is being changed)
    if (!isUpdate && (!userData.password || userData.password.length < 6)) {
      errors.password = 'Password must be at least 6 characters long';
    } else if (isUpdate && userData.password && userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Role validation
    if (userData.role && !['User', 'Admin'].includes(userData.role)) {
      errors.role = 'Role must be either User or Admin';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Search users
  async searchUsers(query) {
    try {
      const response = await api.get('https://localhost:7060/api/User');
      const users = response.data;
      
      if (!query || query.trim() === '') {
        return {
          success: true,
          data: users
        };
      }

      const filteredUsers = users.filter(user => 
        user.username?.toLowerCase().includes(query.toLowerCase()) ||
        user.email?.toLowerCase().includes(query.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        data: filteredUsers
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.Message || error.message || 'Failed to search users'
      };
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      const response = await api.get('https://localhost:7060/api/User');
      const users = response.data;
      
      const stats = {
        totalUsers: users.length,
        adminUsers: users.filter(user => user.role === 'Admin').length,
        regularUsers: users.filter(user => user.role === 'User').length,
        recentUsers: users.filter(user => {
          // Assuming there's a createdAt field, if not available, return empty array
          return false;
        }).length
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.Message || error.message || 'Failed to fetch user statistics'
      };
    }
  }
};