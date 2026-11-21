import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dapcode_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('dapcode_token');
    }
    if (error.response?.data?.code === 1008) {
      const reason =
        error.response.data.message ||
        'Vi phạm quy định và điều khoản sử dụng của hệ thống.';
      localStorage.removeItem('dapcode_token');
      localStorage.removeItem('dapcode_user');
      window.dispatchEvent(new Event('dapcode-auth-change'));
      window.dispatchEvent(
        new CustomEvent('dapcode-user-banned', { detail: { reason } })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
