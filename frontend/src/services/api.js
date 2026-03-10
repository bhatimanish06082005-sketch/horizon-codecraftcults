import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchSales = () => api.get('/sales').then(r => r.data);
export const fetchOrders = () => api.get('/orders').then(r => r.data);
export const fetchInventory = () => api.get('/inventory').then(r => r.data);
export const fetchTickets = () => api.get('/tickets').then(r => r.data);
export const fetchAlerts = () => api.get('/alerts').then(r => r.data);
export const fetchStressScore = () => api.get('/stress-score').then(r => r.data);
export const fetchHistory = (days = 7) => api.get(`/history?days=${days}`).then(r => r.data);
export const acknowledgeAlert = (id) => api.patch(`/alerts/${id}/acknowledge`).then(r => r.data);

export default api;
