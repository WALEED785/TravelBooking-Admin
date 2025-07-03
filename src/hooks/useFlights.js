// src/hooks/useFlights.js
import { useState, useCallback, useEffect } from 'react';
import { 
  getFlights, 
  searchFlights,
  getFlightById, 
  createFlight as createFlightService, 
  updateFlight as updateFlightService, 
  deleteFlight as deleteFlightService 
} from '../services/flightService';

export const useFlights = (autoFetch = true) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFlights();
      
      if (Array.isArray(data)) {
        setFlights(data);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      setError({
        message: err.message || 'Failed to load flights',
        status: err.status,
        details: err.details,
        isNetworkError: !err.response
      });
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (departureId, arrivalId, date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchFlights(departureId, arrivalId, date);
      
      if (Array.isArray(data)) {
        setFlights(data);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      setError({
        message: err.message || 'Failed to search flights',
        status: err.status,
        details: err.details,
        isNetworkError: !err.response
      });
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchFlights();
    }
  }, [autoFetch, fetchFlights]);

  return { 
    flights, 
    loading, 
    error, 
    fetchFlights,
    searchFlights: search,
    isEmpty: !loading && flights.length === 0 
  };
};

export const useFlight = (id) => {
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const fetchFlight = useCallback(async (flightId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFlightById(flightId);
      
      if (data && data.flightId) {
        setFlight(data);
      } else {
        throw new Error('Invalid flight data received');
      }
    } catch (err) {
      setError({
        message: err.message || `Failed to load flight ${flightId}`,
        status: err.status,
        details: err.details,
        isNetworkError: !err.response
      });
      setFlight(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchFlight(id);
    }
  }, [id, fetchFlight]);

  return { 
    flight, 
    loading, 
    error, 
    fetchFlight,
    reset: () => {
      setFlight(null);
      setError(null);
    }
  };
};

export const useFlightMutation = () => {
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
      
      const result = await mutationFn(...args);
      
      setState({
        loading: false,
        error: null,
        success: true,
        data: result
      });
      
      return result;
    } catch (err) {
      console.error('Flight mutation error:', err);
      
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

  const createFlight = useCallback(async (data) => {
    return mutate(createFlightService, data);
  }, [mutate]);

  const updateFlight = useCallback(async (id, data) => {
    return mutate(updateFlightService, id, data);
  }, [mutate]);

  const deleteFlight = useCallback(async (id) => {
    return mutate(deleteFlightService, id);
  }, [mutate]);

  return {
    ...state,
    resetState,
    createFlight,
    updateFlight,
    deleteFlight,
    isError: !!state.error,
    isSuccess: state.success
  };
};