// src/utils/api.js
import axios from 'axios';

// Make sure this matches your backend URL exactly
const API_BASE_URL = 'http://localhost:7060';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      data: config.data,
      params: config.params
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }, 
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - please try again';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error - please check your connection and ensure the backend is running';
    } else if (!error.response) {
      error.message = 'Unable to connect to server - please check if the backend is running on the correct port';
    }

    return Promise.reject(error);
  }
);

// Health check function
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    console.log('API Health Check:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Health Check Failed:', error.message);
    throw error;
  }
};

export default api;