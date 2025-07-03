// src/services/destinationService.js
import api from '../utils/api';

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  debugger  
  if (error.response) {
    // Server responded with error status (4xx, 5xx)
    const errorData = error.response.data;
    throw {
      message: errorData?.message || errorData?.title || defaultMessage,
      status: error.response.status,
      data: errorData,
      details: errorData?.errors || errorData?.details
    };
  } else if (error.request) {
    // Request made but no response
    throw {
      message: 'Unable to connect to server. Please check your connection and try again.',
      status: null,
      networkError: true
    };
  } else {
    // Something else happened
    throw {
      message: error.message || defaultMessage,
      status: null
    };
  }
};

export const getDestinations = async () => {
  try {
    debugger
    console.log('Fetching destinations...');
    const response = await api.get('https://localhost:7060/api/destinations');
    console.log('Destinations response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to fetch destinations');
  }
};

export const getDestinationById = async (id) => {
  try {
    debugger
    console.log(`Fetching destination with ID: ${id}`);
    const response = await api.get(`https://localhost:7060/api/destinations/${id}`);
    console.log('Destination response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, `Failed to fetch destination with ID ${id}`);
  }
};

export const createDestination = async (destinationData) => {
  try {
    debugger
    console.log('Creating destination:', destinationData);
    
    // Validate required fields
    if (!destinationData.name?.trim()) {
      throw new Error('Destination name is required');
    }
    if (!destinationData.country?.trim()) {
      throw new Error('Country is required');
    }
    
    const response = await api.post('https://localhost:7060/api/destinations', destinationData);
    console.log('Create destination response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to create destination');
  }
};

export const updateDestination = async (id, destinationData) => {
  try {
    debugger
    console.log(`Updating destination ${id}:`, destinationData);
    
    // Validate required fields
    if (!destinationData.name?.trim()) {
      throw new Error('Destination name is required');
    }
    if (!destinationData.country?.trim()) {
      throw new Error('Country is required');
    }
    
    const response = await api.put(`https://localhost:7060/api/destinations/${id}`, destinationData);
    console.log('Update destination response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, `Failed to update destination with ID ${id}`);
  }
};

export const deleteDestination = async (id) => {
  try {
    debugger
    console.log(`Deleting destination with ID: ${id}`);
    const response = await api.delete(`https://localhost:7060/api/destinations/${id}`);
    console.log('Delete destination response:', response.status);
    return true; // Successful deletion
  } catch (error) {
    handleError(error, `Failed to delete destination with ID ${id}`);
  }
};