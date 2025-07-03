// src/hooks/useDestinations.js
import { useState, useCallback, useEffect } from 'react';
import { 
  getDestinations, 
  getDestinationById, 
  createDestination, 
  updateDestination, 
  deleteDestination 
} from '../services/destinationService';

export const useDestinations = (autoFetch = true) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(autoFetch); // Initialize based on autoFetch
  const [error, setError] = useState(null);

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching destinations...');
      
      const data = await getDestinations();
      console.log('Received destinations:', data);
      
      if (Array.isArray(data)) {
        setDestinations(data);
      } else {
        console.warn('Expected array of destinations, received:', typeof data);
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Destination fetch error:', err);
      setError({
        message: err.message || 'Failed to load destinations',
        status: err.status,
        details: err.details,
        isNetworkError: !err.response
      });
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchDestinations();
    }
  }, [autoFetch, fetchDestinations]);

  return { 
    destinations, 
    loading, 
    error, 
    fetchDestinations,
    isEmpty: !loading && destinations.length === 0 
  };
};

export const useDestination = (id) => {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(!!id); // Load if ID provided
  const [error, setError] = useState(null);

  const fetchDestination = useCallback(async (destinationId) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching destination ${destinationId}...`);
      
      const data = await getDestinationById(destinationId);
      console.log('Received destination:', data);
      
      if (data && data.destinationId) {
        setDestination(data);
      } else {
        throw new Error('Invalid destination data received');
      }
    } catch (err) {
      console.error(`Error fetching destination ${destinationId}:`, err);
      setError({
        message: err.message || `Failed to load destination ${destinationId}`,
        status: err.status,
        details: err.details,
        isNetworkError: !err.response
      });
      setDestination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when id changes
  useEffect(() => {
    if (id) {
      fetchDestination(id);
    }
  }, [id, fetchDestination]);

  return { 
    destination, 
    loading, 
    error, 
    fetchDestination,
    reset: () => {
      setDestination(null);
      setError(null);
    }
  };
};

export const useDestinationMutation = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    success: false,
    data: null
  });

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      data: null
    });
  }, []);

  const mutate = useCallback(async (mutationFn, ...args) => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        success: false
      }));
      
      console.log('Executing destination mutation:', mutationFn.name, args);
      const result = await mutationFn(...args);
      
      setState({
        loading: false,
        error: null,
        success: true,
        data: result
      });
      
      return result;
    } catch (err) {
      console.error('Destination mutation error:', err);
      
      const errorObj = {
        message: err.message || 'Operation failed',
        status: err.status,
        details: err.details,
        isNetworkError: !err.response
      };
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj,
        success: false
      }));
      
      throw errorObj;
    }
  }, []);

  // Fixed: Use different names to avoid conflicts with imported functions
  const createNewDestination = useCallback(async (data) => {
    return mutate(createDestination, data);
  }, [mutate]);

  const updateExistingDestination = useCallback(async (id, data) => {
    return mutate(updateDestination, id, data);
  }, [mutate]);

  const deleteExistingDestination = useCallback(async (id) => {
    return mutate(deleteDestination, id);
  }, [mutate]);

  return {
    ...state,
    resetState,
    createNewDestination,
    updateExistingDestination,
    deleteExistingDestination,
    isError: !!state.error,
    isSuccess: state.success
  };
};