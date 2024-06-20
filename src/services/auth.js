// authService.js
import { apiClient } from '@/services/api';
import { showToast } from '@/services/toast';

export class AuthService {
  async login(username, password) {
    try {
      const response = await apiClient.post('auth/jwt/create/', {
        username: username,
        password: password
      });

      if (response.data.access) {
        
        if (localStorage.getItem('user')) {
          localStorage.removeItem('user');
        }
        localStorage.setItem('user', JSON.stringify(response.data));
        return { success: true, data: response.data };
      }
      else{
        console.log(!localStorage.getItem('user'))
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          showToast(error.response.data.detail, 'error');
        }
        if (error.response.data.password) {
          showToast(`Password: ${error.response.data.password[0]}`, 'error');
        }
        if (error.response.data.username) {
          showToast(`Username: ${error.response.data.username[0]}`, 'error');
        }
      }
      return { success: false, error: error };
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  async refreshToken() {
    const refreshToken = JSON.parse(localStorage.getItem('user')).refresh;

    try {
      const response = await apiClient.post('auth/jwt/refresh/', {
        refresh: refreshToken
      });

      if (response.data.access) {
        if (localStorage.getItem('user')) {
          localStorage.removeItem('user');
        }
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return { success: true, error: response };
    } catch (error) {
      // Invalidate JWT
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
      }
      return { success: false, error: error };
    }
  }
}
