// services/bookingService.js
import api from '../utils/api';

export const getBookings = async () => {
    try {
        const response = await api.get('https://localhost:7060/api/bookings');
        return response.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error.response?.data || error.message;
    }
};

export const getBookingById = async (id) => {
    try {
        const response = await api.get(`https://localhost:7060/api/bookings/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching booking ${id}:`, error);
        throw error.response?.data || error.message;
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('https://localhost:7060/api/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error.response?.data || error.message;
    }
};

export const updateBooking = async (id, bookingData) => {
    try {
        const response = await api.put(`https://localhost:7060/api/bookings/${id}`, bookingData);
        return response.data;
    } catch (error) {
        console.error(`Error updating booking ${id}:`, error);
        throw error.response?.data || error.message;
    }
};

export const cancelBooking = async (id) => {
    try {
        const response = await api.put(`https://localhost:7060/api/bookings/${id}/cancel`);
        return response.data;
    } catch (error) {
        console.error(`Error canceling booking ${id}:`, error);
        throw error.response?.data || error.message;
    }
};

export const getUserBookings = async (userId) => {
    try {
        const response = await api.get(`https://localhost:7060/api/bookings/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user bookings for ${userId}:`, error);
        throw error.response?.data || error.message;
    }
};