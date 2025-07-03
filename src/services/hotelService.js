import api from '../utils/api';

export const getHotels = async () => {
  try {
    debugger
    const response = await api.get('https://localhost:7060/api/Hotels');
    return response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error.response?.data || error.message;
  }
};

export const getHotelById = async (id) => {
  try {
    debugger
    const response = await api.get(`https://localhost:7060/api/Hotels/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hotel ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

export const createHotel = async (hotelData) => {
  try {
    debugger
    const response = await api.post('https://localhost:7060/api/Hotels', hotelData);
    return response.data;
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw error.response?.data || error.message;
  }
};

export const updateHotel = async (id, hotelData) => {
  try {
    debugger
    const response = await api.put(`https://localhost:7060/api/Hotels/${id}`, hotelData);
    return response.data;
  } catch (error) {
    console.error(`Error updating hotel ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

export const deleteHotel = async (id) => {
  try {
    debugger
    await api.delete(`https://localhost:7060/api/Hotels/${id}`);
  } catch (error) {
    console.error(`Error deleting hotel ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

export const getHotelsByDestination = async (destinationId) => {
  try {
    debugger
    const response = await api.get(`https://localhost:7060/api/Hotels/destination/${destinationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hotels for destination ${destinationId}:`, error);
    throw error.response?.data || error.message;
  }
};