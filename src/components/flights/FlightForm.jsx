import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { useFlight, useFlightMutation } from '../../hooks/useFlights';
import { useDestinations } from '../../hooks/useDestinations';

const FlightForm = ({ open, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { flight, loading: flightLoading, error: flightError } = useFlight(id);
  const { destinations, loading: destinationsLoading, error: destinationsError } = useDestinations();
  const { 
    createFlight, 
    updateFlight, 
    loading: submitting, 
    error: mutationError,
    success,
    resetState
  } = useFlightMutation();

  const [form, setForm] = useState({
    airline: '',
    departureDestinationId: '',
    arrivalDestinationId: '',
    departureTime: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    arrivalTime: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    price: 0
  });

  const [error, setError] = useState(null);

  // Initialize form when flight data loads or changes
  useEffect(() => {
    if (flight && isEditMode) {
      setForm({
        airline: flight.airline,
        departureDestinationId: flight.departureDestinationId,
        arrivalDestinationId: flight.arrivalDestinationId,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        price: flight.price
      });
    }
  }, [flight, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!form.airline) {
      return 'Airline is required';
    }
    if (!form.departureDestinationId) {
      return 'Departure destination is required';
    }
    if (!form.arrivalDestinationId) {
      return 'Arrival destination is required';
    }
    if (form.departureDestinationId === form.arrivalDestinationId) {
      return 'Departure and arrival destinations must be different';
    }
    if (!form.departureTime) {
      return 'Departure time is required';
    }
    if (!form.arrivalTime) {
      return 'Arrival time is required';
    }
    if (new Date(form.arrivalTime) <= new Date(form.departureTime)) {
      return 'Arrival time must be after departure time';
    }
    if (!form.price || form.price <= 0) {
      return 'Price must be greater than 0';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError(null);
      debugger
      if (isEditMode) {
        await updateFlight(id, form);
      } else {
        await createFlight(form);
      }
      
      setTimeout(() => {
        onClose(true); // Close modal and indicate success
      }, 1500);
    } catch (err) {
      console.error('Error submitting flight:', err);
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  const resetForm = () => {
    setForm({
      airline: '',
      departureDestinationId: '',
      arrivalDestinationId: '',
      departureTime: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      arrivalTime: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      price: 0
    });
    setError(null);
    resetState();
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const isLoading = flightLoading || destinationsLoading;
  const errorMessage = error || flightError?.message || destinationsError?.message || mutationError?.message;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditMode ? 'Edit Flight' : 'Create New Flight'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {success && <Alert severity="success">
                {isEditMode ? 'Flight updated successfully!' : 'Flight created successfully!'}
              </Alert>}

              <TextField
                name="airline"
                label="Airline"
                value={form.airline}
                onChange={handleChange}
                fullWidth
                required
              />

              <FormControl fullWidth>
                <InputLabel>Departure Destination</InputLabel>
                <Select
                  name="departureDestinationId"
                  value={form.departureDestinationId || ''}
                  onChange={handleChange}
                  label="Departure Destination"
                  required
                >
                  {destinations.map((destination) => (
                    <MenuItem 
                      key={destination.destinationId} 
                      value={destination.destinationId}
                      disabled={destination.destinationId == form.arrivalDestinationId}
                    >
                      {destination.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Arrival Destination</InputLabel>
                <Select
                  name="arrivalDestinationId"
                  value={form.arrivalDestinationId || ''}
                  onChange={handleChange}
                  label="Arrival Destination"
                  required
                >
                  {destinations.map((destination) => (
                    <MenuItem 
                      key={destination.destinationId} 
                      value={destination.destinationId}
                      disabled={destination.destinationId == form.departureDestinationId}
                    >
                      {destination.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                name="departureTime"
                label="Departure Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={form.departureTime}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                name="arrivalTime"
                label="Arrival Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={form.arrivalTime}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                name="price"
                label="Price"
                type="number"
                value={form.price}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
                required
              />
            </Stack>
          </form>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={submitting || isLoading}
        >
          {submitting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : isEditMode ? (
            'Update Flight'
          ) : (
            'Create Flight'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightForm;