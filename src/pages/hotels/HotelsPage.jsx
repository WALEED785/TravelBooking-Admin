import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
  Rating,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HotelIcon from '@mui/icons-material/Hotel';
import { useHotels, useHotelMutation } from '../../hooks/useHotels';
import HotelForm from '../../components/hotels/HotelForm';

const HotelsPage = () => {
  const { 
    hotels, 
    loading, 
    error, 
    fetchHotels 
  } = useHotels();
  
  const { 
    deleteExistingHotel 
  } = useHotelMutation();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Check if we're on a create or edit route
  const isFormOpen = location.pathname.includes('/hotels/create') || 
                    (location.pathname.includes('/hotels/') && 
                     location.pathname.includes('/edit'));

  // Set selected hotel when edit route is accessed directly
  useEffect(() => {
    if (params.id && isFormOpen) {
      const hotelToEdit = hotels.find(h => h.hotelId.toString() === params.id);
      setSelectedHotel(hotelToEdit || null);
    }
  }, [params.id, isFormOpen, hotels]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleCreateHotel = () => {
    setSelectedHotel(null);
    navigate('/hotels/create');
  };

  const handleEditHotel = (hotelId) => {
    const hotelToEdit = hotels.find(h => h.hotelId === hotelId);
    setSelectedHotel(hotelToEdit);
    navigate(`/hotels/${hotelId}/edit`);
  };

  const handleDeleteClick = (hotel) => {
    setSelectedHotel(hotel);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteExistingHotel(selectedHotel.hotelId);
      fetchHotels();
      setDeleteDialogOpen(false);
      setSelectedHotel(null);
    } catch (err) {
      console.error('Error deleting hotel:', err);
    }
  };

  const handleCloseForm = (shouldRefresh) => {
    navigate('/hotels');
    setSelectedHotel(null);
    if (shouldRefresh) {
      fetchHotels();
    }
  };

  const renderRating = (rating) => {
    return (
      <Box display="flex" alignItems="center">
        <Rating 
          value={rating} 
          precision={0.5} 
          readOnly 
          sx={{ mr: 1 }}
        />
        <Typography>{rating}</Typography>
      </Box>
    );
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
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
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
        <Typography variant="h4">Available Hotels</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateHotel}
        >
          Add Hotel
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr #</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price/Night</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Amenities</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hotels found
                </TableCell>
              </TableRow>
            ) : (
              hotels.map((hotel, index) => (
                <TableRow key={hotel.hotelId} hover>
                  <TableCell>{ index+1 }</TableCell>
                  <TableCell>
                    <Chip 
                      icon={<HotelIcon />} 
                      label={hotel.name} 
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{hotel.destination?.name}</TableCell>
                  <TableCell>${hotel.pricePerNight?.toFixed(2)}</TableCell>
                  <TableCell>{renderRating(hotel.rating)}</TableCell>
                  <TableCell>
                    {hotel.amenities?.split(', ').map((amenity, index) => (
                      <Chip key={index} label={amenity} sx={{ m: 0.5 }} size="small" />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditHotel(hotel.hotelId)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(hotel)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {selectedHotel && (
            <Typography>
              Are you sure you want to delete hotel #{selectedHotel.hotelId} ({selectedHotel.name})?
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

      <HotelForm 
        open={isFormOpen}
        onClose={handleCloseForm}
        hotel={selectedHotel}
      />
    </Box>
  );
};

export default HotelsPage;