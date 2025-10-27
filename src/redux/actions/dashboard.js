import api from '@utils/axiosInstance';

export const getDashboard = () => api.get('/dashboard');
