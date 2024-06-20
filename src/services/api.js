import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    // Add any headers you need (e.g., Authorization token)
  },
});

function getTokenFromLocalStorage() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.access : null;
  }

apiClient.interceptors.request.use(
    async config => {
      const token = getTokenFromLocalStorage(); // Implement your function to get token from local storage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );




