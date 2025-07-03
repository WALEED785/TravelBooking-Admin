import { useState, useCallback, useEffect } from 'react';
import { 
  getHotels, 
  getHotelById, 
  createHotel, 
  updateHotel, 
  deleteHotel,
  getHotelsByDestination
} from '../services/hotelService';

export const useHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHotels();
      setHotels(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  }, []);

  return { hotels, loading, error, fetchHotels };
};

export const useHotel = (id) => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHotelById(id);
      setHotel(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchHotel();
    }
  }, [id, fetchHotel]);


  return { hotel, loading, error, fetchHotel };
};

export const useHotelMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  const createNewHotel = async (hotelData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const data = await createHotel(hotelData);
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create hotel');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingHotel = async (id, hotelData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const data = await updateHotel(id, hotelData);
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update hotel');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingHotel = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await deleteHotel(id);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to delete hotel');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    success, 
    resetState,
    createNewHotel, 
    updateExistingHotel,
    deleteExistingHotel 
  };
};

export const useHotelsByDestination = (destinationId) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotelsByDestination = useCallback(async () => {
    if (!destinationId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getHotelsByDestination(destinationId);
      setHotels(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch hotels by destination');
    } finally {
      setLoading(false);
    }
  }, [destinationId]);

  return { hotels, loading, error, fetchHotelsByDestination };
};