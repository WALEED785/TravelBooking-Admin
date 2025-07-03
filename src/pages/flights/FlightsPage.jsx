import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlightIcon from '@mui/icons-material/Flight';
import { format } from 'date-fns';
import FlightForm from '../../components/flights/FlightForm';
import { useFlights } from '../../hooks/useFlights';
import { useFlightMutation } from '../../hooks/useFlights';

const FlightsPage = () => {
  const { flights, loading, error, fetchFlights } = useFlights();
  const { deleteFlight } = useFlightMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a create or edit route
  const isFormOpen = location.pathname.includes('/flights/create') || 
                    location.pathname.includes('/flights/') && location.pathname.includes('/edit');

  const handleCreateFlight = () => {
    navigate('/flights/create');
  };

  const handleEditFlight = (flightId) => {
    navigate(`/flights/${flightId}/edit`);
  };

  const handleDeleteClick = (flight) => {
    setFlightToDelete(flight);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFlight(flightToDelete.flightId);
      setDeleteDialogOpen(false);
      setFlightToDelete(null);
      fetchFlights(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting flight:', err);
    }
  };

  const handleCloseForm = (success) => {
    if (success) {
      fetchFlights(); // Refresh flights data
    }
    navigate('/flights');
  };

  const formatFlightDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2} color="error.main">
        {error.message || 'Failed to load flights'}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4">Available Flights</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateFlight}
        >
          Add Flight
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Flight ID</TableCell>
              <TableCell>Airline</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Arrival</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight) => (
              <TableRow key={flight.flightId}>
                <TableCell>{flight.flightId}</TableCell>
                <TableCell>
                  <Chip 
                    icon={<FlightIcon />} 
                    label={flight.airline} 
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  {flight.departureDestination?.name} → {flight.arrivalDestination?.name}
                </TableCell>
                <TableCell>{formatFlightDate(flight.departureTime)}</TableCell>
                <TableCell>{formatFlightDate(flight.arrivalTime)}</TableCell>
                <TableCell>${flight.price.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditFlight(flight.flightId)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(flight)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {flightToDelete && (
            <Typography>
              Are you sure you want to delete flight #{flightToDelete.flightId} ({flightToDelete.airline})?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flight Form Modal */}
      <FlightForm 
        open={isFormOpen}
        onClose={handleCloseForm}
      />
    </Box>
  );
};

export default FlightsPage;