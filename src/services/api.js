import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    // Add any headers you need (e.g., Authorization token)
  },
});

