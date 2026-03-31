const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class DrawingService {
  // Get auth token
  _getToken() {
    return localStorage.getItem('access_token');
  }

  getAll(projectId) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return fetch(`${API_BASE_URL}/api/v1/drawings/all${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this._getToken() ? { Authorization: `Bearer ${this._getToken()}` } : {})
      }
    }).then(res => res.json());
  }

  // create uses FormData for file upload — NOT JSON
  create(formData) {
    return fetch(`${API_BASE_URL}/api/v1/drawings/create`, {
      method: 'POST',
      headers: {
        // Do NOT set Content-Type — browser sets it with boundary for FormData
        ...(this._getToken() ? { Authorization: `Bearer ${this._getToken()}` } : {})
      },
      body: formData
    }).then(res => res.json());
  }

  // update uses FormData for optional file upload
  update(id, formData) {
    return fetch(`${API_BASE_URL}/api/v1/drawings/update/${id}`, {
      method: 'PUT',
      headers: {
        // Do NOT set Content-Type — browser sets it with boundary for FormData
        ...(this._getToken() ? { Authorization: `Bearer ${this._getToken()}` } : {})
      },
      body: formData
    }).then(res => res.json());
  }
}

export default new DrawingService();