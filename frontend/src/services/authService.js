import apiService from './apiService';

class AuthService {
  // Login with Keycloak
  async login(username, password) {
    try {
      const response = await apiService.post('/api/v1/auth/login', {
        username,
        password,
      });

      if (response.access_token) {
        // Store tokens in localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Get user info
        const userInfo = await this.getUserInfo();
        return { success: true, user: userInfo };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }

  // Logout from Keycloak
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        await apiService.post('/api/v1/auth/logout', {
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server logout fails
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      localStorage.removeItem('selectedProject');
    }
  }

  // Get user information from Keycloak
  async getUserInfo() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await apiService.get('/api/v1/auth/userinfo');
      
      // Store user data in localStorage
      const userData = {
        name: response.name || response.preferred_username || 'User',
        email: response.email || response.preferred_username,
        username: response.preferred_username,
        roles: response.roles || [],
        ...response
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const authState = localStorage.getItem('isAuthenticated');
    return !!(token && authState === 'true');
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  // Refresh token (if needed in the future)
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      // This endpoint would need to be implemented in the backend
      const response = await apiService.post('/api/v1/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        return response.access_token;
      }
      
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout the user
      await this.logout();
      throw error;
    }
  }
}

export default new AuthService();
