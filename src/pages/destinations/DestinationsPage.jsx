// src/pages/DestinationsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useDestinations, useDestinationMutation } from '../../hooks/useDestinations';
import DestinationForm from '../../components/destinations/DestinationForm';

const DestinationsPage = () => {
  const { destinations, loading, error, fetchDestinations } = useDestinations();
  const { deleteExistingDestination, loading: deleteLoading } = useDestinationMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);

  // Fetch destinations on component mount
  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleOpenCreateForm = () => {
    setEditingDestination(null);
    setFormOpen(true);
  };

  const handleOpenEditForm = (destination) => {
    setEditingDestination(destination);
    setFormOpen(true);
  };

  const handleCloseForm = (shouldRefresh) => {
    setFormOpen(false);
    setEditingDestination(null);
    if (shouldRefresh) {
      fetchDestinations();
    }
  };

  const handleDelete = async (destination) => {
    const confirmMessage = `Are you sure you want to delete "${destination.name}"?`;
    if (window.confirm(confirmMessage)) {
      try {
        await deleteExistingDestination(destination.destinationId);
        // Refresh the list after successful deletion
        fetchDestinations();
      } catch (error) {
        console.error('Delete failed:', error);
        // Error handling is done in the hook
      }
    }
  };

  const handleRefresh = () => {
    fetchDestinations();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        my: 4 
      }}>
        <Typography variant="h4">Destinations</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateForm}
            sx={{ py: 1.5 }}
          >
            New Destination
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Error:</strong> {error.message || error}
          </Typography>
          {error.status && (
            <Typography variant="caption" display="block">
              Status: {error.status}
            </Typography>
          )}
          {error.details && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Details: {JSON.stringify(error.details)}
            </Typography>
          )}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sr #</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Country</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {destinations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No destinations found. Click "New Destination" to add one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  destinations.map((destination, index) => (
                    <TableRow key={destination.destinationId} hover>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {index+1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {destination.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{destination.country}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {destination.description ? (
                            <>
                              {destination.description.substring(0, 60)}
                              {destination.description.length > 60 && '...'}
                            </>
                          ) : (
                            <em>No description</em>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditForm(destination)}
                            disabled={deleteLoading}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(destination)}
                            disabled={deleteLoading}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <DestinationForm
        open={formOpen}
        onClose={handleCloseForm}
        destination={editingDestination}
      />
    </Container>
  );
};

export default DestinationsPage;