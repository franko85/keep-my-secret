import axios from 'axios';
import { getAuthToken } from '../mocks/storage';

// Crea istanza Axios con configurazione base
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere token JWT a ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire errori di risposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token non valido o scaduto
      console.error('Sessione scaduta, effettuare nuovamente il login');
    }
    return Promise.reject(error);
  }
);

export default api;

