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

  function getRefreshTokenFromLocalStorage() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.refresh : null;
  }

  function setTokensInLocalStorage(tokens) {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    user.access = tokens.access;
    user.refresh = tokens.refresh;
    localStorage.setItem('user', JSON.stringify(user));
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

  apiClient.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = getRefreshTokenFromLocalStorage();
        if (refreshToken) {
          try {
            const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}accounts/token/refresh/`, {
              refresh: refreshToken,
            });
            const newTokens = response.data;

            setTokensInLocalStorage(newTokens);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newTokens.access}`;
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
            return apiClient(originalRequest);
          } catch (err) {
            // Handle refresh token failure (e.g., redirect to login)
            console.error('Refresh token failed', err);
            // Optionally, clear tokens from localStorage
            localStorage.removeItem('user');
            return Promise.reject(err);
          }
        }
      }
      return Promise.reject(error);
    }
  );
  



