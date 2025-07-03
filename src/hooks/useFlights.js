// src/hooks/useFlights.js
import { useState, useCallback, useEffect } from 'react';
import {
  getFlights,
  searchFlights as searchFlightsService,
  getFlightById,
  createFlight as createFlightService,
  updateFlight as updateFlightService,
  deleteFlight as deleteFlightService,
  getFlightsByDestination as getFlightsByDestinationService
} from '../services/flightService';

/* ----------------------------------------------------------
 *  Shared helpers
 * -------------------------------------------------------- */
const buildError = (err, fallback) => ({
  message: err?.message || fallback,
  status: err?.status,
  details: err?.details,
  isNetworkError: err?.networkError || !err?.response
});

/* ----------------------------------------------------------
 *  1️⃣  Hook: useFlights — list or search
 * -------------------------------------------------------- */
export const useFlights = (autoFetch = true) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFlights();
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      setFlights(data);
    } catch (err) {
      setError(buildError(err, 'Failed to load flights'));
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFlights = useCallback(async (departureId, arrivalId, date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchFlightsService(departureId, arrivalId, date);
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      setFlights(data);
    } catch (err) {
      setError(buildError(err, 'Failed to search flights'));
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* initial fetch */
  useEffect(() => {
    if (autoFetch) fetchFlights();
  }, [autoFetch, fetchFlights]);

  return {
    flights,
    loading,
    error,
    fetchFlights,
    searchFlights,
    isEmpty: !loading && flights.length === 0
  };
};

/* ----------------------------------------------------------
 *  2️⃣  Hook: useFlightsByDestination — list by destination
 * -------------------------------------------------------- */
export const useFlightsByDestination = (destinationId) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(!!destinationId);
  const [error, setError] = useState(null);

  const fetchFlightsByDestination = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFlightsByDestinationService(id);
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      setFlights(data);
    } catch (err) {
      setError(buildError(err, `Failed to load flights for destination ${id}`));
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (destinationId) fetchFlightsByDestination(destinationId);
  }, [destinationId, fetchFlightsByDestination]);

  return {
    flights,
    loading,
    error,
    fetchFlightsByDestination,
    isEmpty: !loading && flights.length === 0
  };
};

/* ----------------------------------------------------------
 *  3️⃣  Hook: useFlight — single flight
 * -------------------------------------------------------- */
export const useFlight = (id) => {
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const fetchFlight = useCallback(async (flightId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFlightById(flightId);
      if (!data?.flightId) throw new Error('Invalid flight data');
      setFlight(data);
    } catch (err) {
      setError(buildError(err, `Failed to load flight ${flightId}`));
      setFlight(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchFlight(id);
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

/* ----------------------------------------------------------
 *  4️⃣  Hook: useFlightMutation — create / update / delete
 * -------------------------------------------------------- */
export const useFlightMutation = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    success: false,
    data: null
  });

  const resetState = useCallback(() => {
    setState({ loading: false, error: null, success: false, data: null });
  }, []);

  const mutate = useCallback(async (fn, ...args) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null, success: false }));
      const result = await fn(...args);
      setState({ loading: false, error: null, success: true, data: result });
      return result;
    } catch (err) {
      const errObj = buildError(err, 'Operation failed');
      setState({ loading: false, error: errObj, success: false, data: null });
      throw errObj;
    }
  }, []);

  return {
    ...state,
    resetState,
    createFlight: (data) => mutate(createFlightService, data),
    updateFlight: (id, data) => mutate(updateFlightService, id, data),
    deleteFlight: (id) => mutate(deleteFlightService, id),
    isError: !!state.error,
    isSuccess: state.success
  };
};
