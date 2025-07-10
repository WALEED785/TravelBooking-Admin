import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Place as DestinationIcon,
  People as UserIcon,
  Event as BookingIcon,
  TrendingUp as StatsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import { Navigate } from 'react-router-dom';
import { getBookings } from '../../services/bookingService';
import { getDestinations } from '../../services/destinationService';
import { getFlights } from '../../services/flightService'; // Import flight service
import { getHotels } from '../../services/hotelService';   // Import hotel service

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user: currentUser, loading: authLoading } = useAuth();
  const { users, loading: userLoading, getUserStats } = useUser();

  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings function
  const fetchBookings = async () => {
    try {
      setBookingLoading(true);
      const bookingData = await getBookings();
      setBookings(bookingData);
      setBookingLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
      setBookingLoading(false);
    }
  };

  // Fetch destinations function
  const fetchDestinations = async () => {
    try {
      setDestinationLoading(true);
      const destinationData = await getDestinations();
      setDestinations(destinationData);
      setDestinationLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load destinations');
      setDestinationLoading(false);
    }
  };

  // Fetch flights function
  const fetchFlights = async () => {
    try {
      setFlightLoading(true);
      const flightData = await getFlights();
      setFlights(flightData);
      setFlightLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load flights');
      setFlightLoading(false);
    }
  };

  // Fetch hotels function
  const fetchHotels = async () => {
    try {
      setHotelLoading(true);
      const hotelData = await getHotels();
      setHotels(hotelData);
      setHotelLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load hotels');
      setHotelLoading(false);
    }
  };

  // Fetch all data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchBookings(),
          fetchDestinations(),
          fetchFlights(), // Use our fetchFlights function
          fetchHotels(),  // Use our fetchHotels function
        ]);
        
        const statsResult = await getUserStats();
        if (statsResult.success) {
          setStats(statsResult.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [getUserStats]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Redirect if not authenticated
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  // Refresh data
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBookings(),
        fetchDestinations(),
        fetchFlights(),
        fetchHotels(),
      ]);
      
      const statsResult = await getUserStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
      setLoading(false);
    }
  };

  // Stats card component
  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar sx={{ bgcolor: `${color}20`, color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );

  // Simple Recent Bookings Table
  const RecentBookingsTable = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Bookings
        </Typography>
        {bookingLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings?.slice(0, 5).map((booking) => (
                  console.log(booking),
                  <TableRow key={booking.id}>
                    <TableCell>{booking.hotelName ?? booking.flightName}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  // Simple Recent Flights Table
  const RecentFlightsTable = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Flights
        </Typography>
        {flightLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Airline</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Departure</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flights?.slice(0, 5).map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell>{flight.airline}</TableCell>
                    <TableCell>{flight.departureDestination} → {flight.arrivalDestination}</TableCell>
                    <TableCell>{new Date(flight.departureTime).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  // Simple Recent Hotels Table
  const RecentHotelsTable = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Hotels
        </Typography>
        {hotelLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Price/Night</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hotels?.slice(0, 5).map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell>{hotel.name}</TableCell>
                    <TableCell>{hotel.location}</TableCell>
                    <TableCell>PKR- {hotel.pricePerNight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<BookingIcon />}
                title="Total Bookings"
                value={bookings?.length || 0}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<DestinationIcon />}
                title="Destinations"
                value={destinations?.length || 0}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<FlightIcon />}
                title="Available Flights"
                value={flights?.length || 0}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<HotelIcon />}
                title="Available Hotels"
                value={hotels?.length || 0}
                color={theme.palette.success.main}
              />
            </Grid>
          </Grid>

          {/* User Stats (Admin only) */}
          {currentUser?.role === 'Admin' && stats && (
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={<UserIcon />}
                  title="Total Users"
                  value={stats.totalUsers}
                  color={theme.palette.warning.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={<UserIcon />}
                  title="Admin Users"
                  value={stats.adminUsers}
                  color={theme.palette.error.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={<UserIcon />}
                  title="Regular Users"
                  value={stats.regularUsers}
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={<StatsIcon />}
                  title="Recent Activity"
                  value={stats.recentUsers}
                  color={theme.palette.info.main}
                />
              </Grid>
            </Grid>
          )}

          {/* Charts and Recent Data */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bookings Overview
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="textSecondary">
                      Booking chart will be displayed here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Pending Bookings</Typography>
                      <Typography fontWeight="bold">
                        {bookings?.filter(b => b.status === 'Pending').length || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Confirmed Bookings</Typography>
                      <Typography fontWeight="bold">
                        {bookings?.filter(b => b.status === 'Confirmed').length || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Cancelled Bookings</Typography>
                      <Typography fontWeight="bold">
                        {bookings?.filter(b => b.status === 'Cancelled').length || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Popular Destination</Typography>
                      <Typography fontWeight="bold">
                        {destinations?.[0]?.name || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Data Tables */}
          {bookings?.length > 0 && <RecentBookingsTable />}
          {flights?.length > 0 && <RecentFlightsTable />}
          {hotels?.length > 0 && <RecentHotelsTable />}
        </>
      )}
    </Box>
  );
};

export default DashboardPage;