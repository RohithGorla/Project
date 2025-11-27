import axios from 'axios';

const api = axios.create({
  baseURL: 'https://YOUR-RENDER-URL.onrender.com/api', // put your actual Render URL here
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
