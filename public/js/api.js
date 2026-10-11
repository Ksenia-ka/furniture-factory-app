const API = {
  baseURL: 'http://localhost:3000/api',
  token: localStorage.getItem('token') || null,

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  },

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  },

  async request(endpoint, method = 'GET', data = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login.html';
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      return { success: false, data: [] };
    }
  },

  auth: {
    login(email, password) {
      return API.request('/auth/login', 'POST', { email, password });
    },
    register(email, password, full_name) {
      return API.request('/auth/register', 'POST', { email, password, full_name });
    },
    getCurrentUser() {
      return API.request('/auth/me', 'GET');
    },
  },

  materials: {
    getAll() {
      return API.request('/materials', 'GET');
    },
  },

  hardware: {
    getAll() {
      return API.request('/hardware', 'GET');
    },
  },

  tasks: {
    getAll() {
      return API.request('/tasks', 'GET');
    },
    create(data) {
      return API.request('/tasks', 'POST', data);
    },
    updateStatus(id, status) {
      return API.request(`/tasks/${id}/status`, 'PUT', { status });
    },
  },
};
