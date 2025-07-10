import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import ProfileForm from '../../components/profiles/ProfileForm';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

const ProfilePage = () => {
  const { user: authUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user from auth
        const currentUser = authService.getCurrentUser();
        
        if (!currentUser) {
          setError('User not authenticated');
          return;
        }

        // Fetch detailed user profile from API
        const result = await authService.getUserProfile(currentUser.userId);
        
        if (result.success) {
          setUser(result.data);
        } else {
          // If API call fails, use the stored user data
          setUser({
            userId: currentUser.userId,
            username: currentUser.username,
            role: currentUser.role,
            email: currentUser.email || '',
            fullName: currentUser.fullName || ''
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        
        // Fallback to stored user data
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser({
            userId: currentUser.userId,
            username: currentUser.username,
            role: currentUser.role,
            email: currentUser.email || '',
            fullName: currentUser.fullName || ''
          });
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateSuccess = async (updatedData) => {
    try {
      // Update the local user state
      setUser(prevUser => ({
        ...prevUser,
        ...updatedData
      }));
      
      // Update the auth context
      await updateProfile(user.userId, updatedData);
      
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      // Still close edit mode even if context update fails
      setEditMode(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={2}>
        <Alert severity="warning">No user data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      {!editMode ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {user.fullName || user.username || 'User'}
              </Typography>
              <Chip 
                label={user.role || 'User'} 
                color={user.role === 'Admin' ? 'secondary' : 'primary'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ '& > div': { mb: 2 } }}>
            <Box display="flex" alignItems="center">
              <PersonIcon color="action" sx={{ mr: 2 }} />
              <Typography>
                <strong>Username:</strong> {user.username || 'N/A'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center">
              <EmailIcon color="action" sx={{ mr: 2 }} />
              <Typography>
                <strong>Email:</strong> {user.email || 'N/A'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center">
              <BadgeIcon color="action" sx={{ mr: 2 }} />
              <Typography>
                <strong>Full Name:</strong> {user.fullName || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              color="primary"
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>
      ) : (
        <ProfileForm 
          user={user} 
          onCancel={handleCancelEdit}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </Box>
  );
};

export default ProfilePage;