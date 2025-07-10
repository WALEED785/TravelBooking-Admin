import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  CircularProgress,
  Tooltip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import UserForm from '../../components/users/UserForm';

const UserPage = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const {
    users,
    loading,
    error,
    searchQuery,
    selectedUser,
    searchUsers,
    getUserById,
    deleteUser,
    getUserStats,
    clearError,
    clearSelectedUser
  } = useUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [stats, setStats] = useState(null);

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'Admin';

  // Fetch user statistics when component mounts
  useEffect(() => {
    if (isAdmin) {
      const fetchStats = async () => {
        const result = await getUserStats();
        if (result.success) {
          setStats(result.data);
        }
      };
      
      fetchStats();
    }
  }, [isAdmin, getUserStats]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers(searchTerm);
      } else {
        searchUsers(''); // This should fetch all users
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUsers]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Redirect if not authenticated or not admin
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle add new user
  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  // Handle edit user
  const handleEditUser = async (user) => {
    const result = await getUserById(user.userId);
    if (result.success) {
      setEditingUser(result.data);
      setShowForm(true);
    }
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (userToDelete) {
      const result = await deleteUser(userToDelete.userId);
      if (result.success) {
        // Update stats
        const statsResult = await getUserStats();
        if (statsResult.success) {
          setStats(statsResult.data);
        }
      }
    }
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
    clearSelectedUser();
  };

  // Handle form success
  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingUser(null);
    clearSelectedUser();
    
    // Refresh stats
    const statsResult = await getUserStats();
    if (statsResult.success) {
      setStats(statsResult.data);
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    return role === 'Admin' ? 'error' : 'primary';
  };

  // Get role icon
  const getRoleIcon = (role) => {
    return role === 'Admin' ? <AdminIcon /> : <PersonIcon />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
          disabled={loading}
        >
          Add New User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {stats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Admin Users
                </Typography>
                <Typography variant="h4">
                  {stats.adminUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Regular Users
                </Typography>
                <Typography variant="h4">
                  {stats.regularUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Recent Users
                </Typography>
                <Typography variant="h4">
                  {stats.recentUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by username, email, or full name..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId} hover>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      {user.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      {user.fullName || 'N/A'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role}
                      color={getRoleColor(user.role)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit User">
                      <IconButton
                        onClick={() => handleEditUser(user)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        onClick={() => handleDeleteUser(user)}
                        color="error"
                        size="small"
                        disabled={user.userId === currentUser?.userId}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Form Dialog */}
      <Dialog
        open={showForm}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <UserForm
            user={editingUser}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{userToDelete?.username}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;