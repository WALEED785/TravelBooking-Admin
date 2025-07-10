import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Stack, MenuItem,
  FormControl, InputLabel, Select, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, Alert, IconButton
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import CloseIcon from '@mui/icons-material/Close';

import {
  getBookingById,
  createBooking,
  updateBooking
} from '../../services/bookingService';
import { getDestinations } from '../../services/destinationService';
import { getFlightsByDestination } from '../../services/flightService';
import { getHotelsByDestination } from '../../services/hotelService';

const BookingForm = ({ open, onClose, bookingId }) => {
  const isEdit = Boolean(bookingId);

  const [bookingType, setBookingType] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState('');
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).userId : null;

  const [form, setForm] = useState({
    userId: userId,
    hotelId: null,
    flightId: null,
    totalPrice: 0,
    status: 'Confirmed'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        const [destData, booking] = await Promise.all([
          getDestinations(),
          isEdit ? getBookingById(bookingId) : Promise.resolve(null)
        ]);

        setDestinations(destData);

        if (isEdit && booking) {
          const type = booking.hotelId ? 'hotel' : 'flight';
          setBookingType(type);
          setDestinationId(booking.destinationId);
          setForm({
            userId: booking.userId,
            hotelId: booking.hotelId,
            flightId: booking.flightId,
            totalPrice: booking.totalPrice,
            status: booking.status
          });
        } else {
          // reset form for create
          setBookingType('');
          setDestinationId('');
          setForm({
            userId: userId,
            hotelId: null,
            flightId: null,
            totalPrice: 0,
            status: 'Confirmed'
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [bookingId, isEdit, open]);

  useEffect(() => {
    if (!destinationId || !bookingType) return;

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        if (bookingType === 'hotel') {
          const data = await getHotelsByDestination(destinationId);
          setHotels(data);
        } else {
          const data = await getFlightsByDestination(destinationId);
          setFlights(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [destinationId, bookingType]);

  const handleBookingType = (value) => {
    setBookingType(value);
    setForm(prev => ({ ...prev, hotelId: null, flightId: null }));
    setDestinationId('');
    setHotels([]);
    setFlights([]);
  };

  const handleDestination = (value) => {
    setDestinationId(value);
    setForm(prev => ({ ...prev, hotelId: null, flightId: null }));
  };

  const handleSelectItem = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      hotelId: name === 'hotelId' ? value : null,
      flightId: name === 'flightId' ? value : null
    }));
  };

  const getPrice = () => {
    if (bookingType === 'hotel' && form.hotelId) {
      const h = hotels.find(h => h.hotelId === form.hotelId);
      return h?.pricePerNight ?? 0;
    }
    if (bookingType === 'flight' && form.flightId) {
      const f = flights.find(f => f.flightId === form.flightId);
      return f?.price ?? 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const payload = {
        userId: form.userId,
        destinationId,
        hotelId: bookingType === 'hotel' ? form.hotelId : null,
        flightId: bookingType === 'flight' ? form.flightId : null,
        totalPrice: getPrice(),
        status: form.status
      };

      if (isEdit) {
        await updateBooking(bookingId, payload);
      } else {
        await createBooking(payload);
      }

      onClose(true);
    } catch (err) {
      setError(err.message || 'Failed to save booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{isEdit ? 'Edit Booking' : 'Create Booking'}</Typography>
          <IconButton onClick={() => onClose(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl fullWidth>
            <InputLabel>Booking Type</InputLabel>
            <Select
              value={bookingType}
              label="Booking Type"
              onChange={(e) => handleBookingType(e.target.value)}
            >
              <MenuItem value="hotel"><HotelIcon sx={{ mr: 1 }} /> Hotel</MenuItem>
              <MenuItem value="flight"><FlightIcon sx={{ mr: 1 }} /> Flight</MenuItem>
            </Select>
          </FormControl>

          {bookingType && (
            <FormControl fullWidth>
              <InputLabel>Destination</InputLabel>
              <Select
                value={destinationId}
                label="Destination"
                onChange={(e) => handleDestination(e.target.value)}
              >
                {destinations.map(d => (
                  <MenuItem key={d.destinationId} value={d.destinationId}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {bookingType === 'hotel' && destinationId && (
            <FormControl fullWidth>
              <InputLabel>Select Hotel</InputLabel>
              <Select
                name="hotelId"
                value={form.hotelId || ''}
                label="Select Hotel"
                onChange={handleSelectItem}
              >
                {hotels.map(h => (
                  <MenuItem key={h.hotelId} value={h.hotelId}>
                    {h.name} – PKR {h.pricePerNight}/night
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {bookingType === 'flight' && destinationId && (
            <FormControl fullWidth>
              <InputLabel>Select Flight</InputLabel>
              <Select
                name="flightId"
                value={form.flightId || ''}
                label="Select Flight"
                onChange={handleSelectItem}
              >
                {flights.map(f => (
                  <MenuItem key={f.flightId} value={f.flightId}>
                    {f.airline} • {f.route} – PKR {f.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            label="Total Price"
            value={`PKR- ${getPrice().toFixed(2)}`}
            InputProps={{ readOnly: true }}
            fullWidth
          />

          {isEdit && (
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                label="Status"
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => onClose(false)} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            !bookingType ||
            !destinationId ||
            (bookingType === 'hotel' && !form.hotelId) ||
            (bookingType === 'flight' && !form.flightId)
          }
        >
          {loading ? <CircularProgress size={24} /> : isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingForm;
