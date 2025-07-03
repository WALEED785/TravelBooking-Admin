import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { getFlightsByDestination } from '../../services/flightService'
import { getHotelsByDestination } from '../../services/hotelService'

const BookingForm = ({ open, onClose }) => {
  /* -------------------------------------------------- */
  /* ****************** Local state ******************* */
  /* -------------------------------------------------- */
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [bookingType, setBookingType] = useState('');     // 'hotel' | 'flight'
  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState('');
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);

  const [form, setForm] = useState({
    userId: 5,
    hotelId: null,
    flightId: null,
    totalPrice: 0,
    status: 'Confirmed'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* -------------------------------------------------- */
  /* --------------- Initial data load ---------------- */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch all destinations in parallel with booking (if edit)
        const [destData, booking] = await Promise.all([
          getDestinations(),
          isEdit ? getBookingById(id) : Promise.resolve(null)
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
        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEdit, open]);

  /* -------------------------------------------------- */
  /* --- When user picks a destination, fetch items --- */
  /* -------------------------------------------------- */
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

  /* -------------------------------------------------- */
  /* ------------------ Handlers ---------------------- */
  /* -------------------------------------------------- */
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
        await updateBooking(id, payload);
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

  /* -------------------------------------------------- */
  /* ------------------- JSX -------------------------- */
  /* -------------------------------------------------- */
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

          {/* 1️⃣ Booking type */}
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

          {/* 2️⃣ Destination */}
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

          {/* 3️⃣ Hotel / Flight */}
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
                    {h.name} – ${h.pricePerNight}/night
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
                    {f.airline} • {f.route} – ${f.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Price (read‑only) */}
          <TextField
            label="Total Price"
            value={`$${getPrice().toFixed(2)}`}
            InputProps={{ readOnly: true }}
            fullWidth
          />

          {/* Status (edit only) */}
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
