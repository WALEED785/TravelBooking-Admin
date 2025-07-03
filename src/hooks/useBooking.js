// hooks/useBooking.js
import { useState } from 'react';
import { 
  getBookings, 
  getBookingById, 
  createBooking, 
  cancelBooking,
  getUserBookings 
} from '../services/bookingService';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return { bookings, loading, error, fetchBookings };
};

export const useBooking = (id) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookingById(id);
      setBooking(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch booking');
    } finally {
      setLoading(false);
    }
  };

  return { booking, loading, error, fetchBooking };
};

export const useBookingMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createNewBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const data = await createBooking(bookingData);
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelExistingBooking = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await cancelBooking(id);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    success, 
    createNewBooking, 
    cancelExistingBooking 
  };
};

export const useUserBookings = (userId) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserBookings(userId);
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch user bookings');
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, fetchUserBookings };
};