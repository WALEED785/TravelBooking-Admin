// src/hooks/useUser.js
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export const useUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getAllUsers();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search users
  const searchUsers = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    
    try {
      const result = await userService.searchUsers(query);
      
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to search users');
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user by ID
  const getUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getUserById(id);
      
      if (result.success) {
        setSelectedUser(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch user';
      setError(errorMessage);
      console.error('Error fetching user:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new user
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate user data
      const validation = userService.validateUserData(userData, false);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      const result = await userService.createUser(userData);
      
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to create user';
      setError(errorMessage);
      console.error('Error creating user:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Update user
  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate user data
      const validation = userService.validateUserData(userData, true);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      const result = await userService.updateUser(id, userData);
      
      if (result.success) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.userId === id ? { ...user, ...userData } : user
          )
        );
        
        // Update selected user if it's the one being updated
        if (selectedUser && selectedUser.userId === id) {
          setSelectedUser(prev => ({ ...prev, ...userData }));
        }
        
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to update user';
      setError(errorMessage);
      console.error('Error updating user:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  // Delete user
  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.deleteUser(id);
      
      if (result.success) {
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(user => user.userId !== id));
        
        // Clear selected user if it's the one being deleted
        if (selectedUser && selectedUser.userId === id) {
          setSelectedUser(null);
        }
        
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to delete user';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  // Get user statistics
  const getUserStats = useCallback(async () => {
    try {
      const result = await userService.getUserStats();
      return result;
    } catch (err) {
      console.error('Error fetching user stats:', err);
      return { success: false, error: 'Failed to fetch user statistics' };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear selected user
  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    searchQuery,
    selectedUser,
    fetchUsers,
    searchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
    clearError,
    clearSelectedUser,
    setSelectedUser
  };
};