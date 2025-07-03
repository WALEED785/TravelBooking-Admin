// src/services/flightService.js
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

export const getFlights = async () => {
  try {
    debugger
    console.log('Fetching flights...');
    const response = await api.get('https://localhost:7060/api/flights');
    console.log('Flights response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to fetch flights');
  }
};

export const searchFlights = async (departureId, arrivalId, date) => {
  try {
    debugger
    console.log(`Searching flights from ${departureId} to ${arrivalId} on ${date}`);
    const params = {
      departureId,
      arrivalId,
      date: date ? date.toISOString() : undefined
    };
    const response = await api.get('https://localhost:7060/api/flights/search', { params });
    console.log('Flights search response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to search flights');
  }
};

export const getFlightById = async (id) => {
  try {
    debugger
    console.log(`Fetching flight with ID: ${id}`);
    const response = await api.get(`https://localhost:7060/api/flights/${id}`);
    console.log('Flight response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, `Failed to fetch flight with ID ${id}`);
  }
};

export const createFlight = async (flightData) => {
  try {
    debugger
    console.log('Creating flight:', flightData);
    
    // Validate required fields
    if (!flightData.airline?.trim()) {
      throw new Error('Airline is required');
    }
    if (!flightData.departureDestinationId) {
      throw new Error('Departure destination is required');
    }
    if (!flightData.arrivalDestinationId) {
      throw new Error('Arrival destination is required');
    }
    if (flightData.departureDestinationId === flightData.arrivalDestinationId) {
      throw new Error('Departure and arrival destinations must be different');
    }
    if (!flightData.departureTime) {
      throw new Error('Departure time is required');
    }
    if (!flightData.arrivalTime) {
      throw new Error('Arrival time is required');
    }
    if (new Date(flightData.arrivalTime) <= new Date(flightData.departureTime)) {
      throw new Error('Arrival time must be after departure time');
    }
    if (!flightData.price || flightData.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    
    const response = await api.post('https://localhost:7060/api/flights', flightData);
    console.log('Create flight response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to create flight');
  }
};

export const updateFlight = async (id, flightData) => {
  try {
    debugger
    console.log(`Updating flight ${id}:`, flightData);
    
    // Validate required fields
    if (!flightData.airline?.trim()) {
      throw new Error('Airline is required');
    }
    if (!flightData.departureDestinationId) {
      throw new Error('Departure destination is required');
    }
    if (!flightData.arrivalDestinationId) {
      throw new Error('Arrival destination is required');
    }
    if (flightData.departureDestinationId === flightData.arrivalDestinationId) {
      throw new Error('Departure and arrival destinations must be different');
    }
    if (!flightData.departureTime) {
      throw new Error('Departure time is required');
    }
    if (!flightData.arrivalTime) {
      throw new Error('Arrival time is required');
    }
    if (new Date(flightData.arrivalTime) <= new Date(flightData.departureTime)) {
      throw new Error('Arrival time must be after departure time');
    }
    if (!flightData.price || flightData.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    
    const response = await api.put(`https://localhost:7060/api/flights/${id}`, flightData);
    console.log('Update flight response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, `Failed to update flight with ID ${id}`);
  }
};

export const deleteFlight = async (id) => {
  try {
    debugger
    console.log(`Deleting flight with ID: ${id}`);
    const response = await api.delete(`https://localhost:7060/api/flights/${id}`);
    console.log('Delete flight response:', response.status);
    return true; // Successful deletion
  } catch (error) {
    handleError(error, `Failed to delete flight with ID ${id}`);
  }
};

export const getFlightsByDestination = async (destinationId) => {
  try {
    debugger
    const response = await api.get(`https://localhost:7060/api/flights/destination/${destinationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hotels for destination ${destinationId}:`, error);
    throw error.response?.data || error.message;
  }
};
