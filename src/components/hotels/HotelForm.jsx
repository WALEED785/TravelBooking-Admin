import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
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
  IconButton,
  Rating,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useHotelMutation } from '../../hooks/useHotels';
import { useDestinations } from '../../hooks/useDestinations';

const HotelForm = ({ open, onClose, hotel }) => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { 
    loading: mutationLoading, 
    error: mutationError, 
    success: mutationSuccess, 
    resetState,
    createNewHotel, 
    updateExistingHotel 
  } = useHotelMutation();

  const { destinations, loading: destinationsLoading, error: destinationsError } = useDestinations();

  const [form, setForm] = useState({
    name: '',
    destinationId: '',
    pricePerNight: 0,
    rating: 0,
    amenities: ''
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (open) {
      if (hotel) {
        setForm({
          name: hotel.name,
          destinationId: hotel.destinationId,
          pricePerNight: hotel.pricePerNight,
          rating: hotel.rating || 0,
          amenities: hotel.amenities || ''
        });
      } else {
        setForm({
          name: '',
          destinationId: '',
          pricePerNight: 0,
          rating: 0,
          amenities: ''
        });
      }
      resetState();
    }
  }, [open, hotel, resetState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setForm(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleAddAmenity = () => {
    const trimmedAmenity = newAmenity.trim();
    if (trimmedAmenity && !form.amenities.split(', ').includes(trimmedAmenity)) {
      setForm(prev => ({
        ...prev,
        amenities: prev.amenities 
          ? `${prev.amenities}, ${trimmedAmenity}`
          : trimmedAmenity
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities
        .split(', ')
        .filter(amenity => amenity !== amenityToRemove)
        .join(', ')
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return 'Hotel name is required';
    }
    if (!form.destinationId) {
      return 'Destination is required';
    }
    if (!form.pricePerNight || form.pricePerNight <= 0) {
      return 'Price per night must be greater than 0';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      if (isEditMode) {
        await updateExistingHotel(id, form);
      } else {
        await createNewHotel(form);
      }
      
      setTimeout(() => {
        onClose(true);
      }, 1500);
    } catch (err) {
      console.error('Error submitting hotel:', err);
    }
  };

  const handleClose = () => {
    if (!mutationLoading) {
      onClose(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditMode ? 'Edit Hotel' : 'Create New Hotel'}
          </Typography>
          <IconButton onClick={handleClose} disabled={mutationLoading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {destinationsLoading && (
              <Alert severity="info">Loading destinations...</Alert>
            )}
            
            {destinationsError && (
              <Alert severity="error">{destinationsError.message}</Alert>
            )}

            {validationError && (
              <Alert severity="error" onClose={() => setValidationError(null)}>
                {validationError}
              </Alert>
            )}
            
            {mutationError && (
              <Alert severity="error" onClose={resetState}>
                {mutationError.message}
              </Alert>
            )}
            
            {mutationSuccess && (
              <Alert severity="success">
                {isEditMode ? 'Hotel updated successfully!' : 'Hotel created successfully!'}
              </Alert>
            )}

            <TextField
              name="name"
              label="Hotel Name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              disabled={mutationLoading}
              error={!!validationError && !form.name.trim()}
            />

            <FormControl fullWidth error={!!validationError && !form.destinationId}>
              <InputLabel>Destination *</InputLabel>
              <Select
                name="destinationId"
                value={form.destinationId || ''}
                onChange={handleChange}
                label="Destination *"
                required
                disabled={mutationLoading || destinationsLoading}
              >
                {destinations.map((destination) => (
                  <MenuItem key={destination.destinationId} value={destination.destinationId}>
                    {destination.name} ({destination.country})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="pricePerNight"
              label="Price Per Night"
              type="number"
              value={form.pricePerNight}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              required
              disabled={mutationLoading}
              error={!!validationError && (!form.pricePerNight || form.pricePerNight <= 0)}
            />

            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={Number(form.rating)}
                onChange={handleRatingChange}
                precision={0.5}
                disabled={mutationLoading}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Amenities</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  label="Add amenity"
                  size="small"
                  fullWidth
                  disabled={mutationLoading}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddAmenity}
                  disabled={!newAmenity.trim() || mutationLoading}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {form.amenities.split(', ').filter(a => a).map((amenity, index) => (
                  <Chip
                    key={index}
                    label={amenity}
                    onDelete={() => !mutationLoading && handleRemoveAmenity(amenity)}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </form>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={mutationLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={mutationLoading}
        >
          {mutationLoading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : isEditMode ? (
            'Update Hotel'
          ) : (
            'Create Hotel'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HotelForm;