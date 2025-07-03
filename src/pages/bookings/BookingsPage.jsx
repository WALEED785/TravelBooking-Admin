// pages/bookings/BookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Box,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import { format } from 'date-fns';
import BookingForm from '../../components/bookings/BookingForm';
import { getBookings, cancelBooking } from '../../services/bookingService';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isFormOpen = location.pathname.includes('/bookings/create') || 
                    (location.pathname.includes('/bookings/') && location.pathname.includes('/edit'));

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCreateBooking = () => {
    navigate('/bookings/create');
  };

  const handleEditBooking = (id) => {
    navigate(`/bookings/${id}/edit`);
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await cancelBooking(bookingToDelete.bookingId);
      setDeleteDialogOpen(false);
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    }
  };

  const handleCloseForm = (shouldRefresh) => {
    if (shouldRefresh) {
      fetchBookings();
    }
    navigate('/bookings');
  };

  const getBookingType = (booking) => {
    if (booking.hotelId) return { type: 'Hotel', icon: <HotelIcon /> };
    if (booking.flightId) return { type: 'Flight', icon: <FlightIcon /> };
    return { type: 'Unknown', icon: null };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Bookings</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateBooking}>
          New Booking
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr #</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking, index) => {
                const { type, icon } = getBookingType(booking);
                return (
                  <TableRow key={booking.bookingId}>
                    <TableCell>{ index+1 }</TableCell>
                    <TableCell><Chip icon={icon} label={type} /></TableCell>
                    <TableCell>
                      {type === 'Hotel' ? `Hotel ID: ${booking.hotelId}` : `Flight ID: ${booking.flightId}`}
                    </TableCell>
                    <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={booking.status} color={
                        booking.status === 'Confirmed' ? 'success' : 
                        booking.status === 'Pending' ? 'warning' : 'error'
                      } />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditBooking(booking.bookingId)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteClick(booking)}
                        disabled={booking.status === 'Cancelled'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <BookingForm open={isFormOpen} onClose={handleCloseForm} />
    </Box>
  );
};

export default BookingsPage;