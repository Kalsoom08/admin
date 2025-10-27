import api from '@utils/axiosInstance';
export const login = data => api.post('/user/login', data);
export const logout = () => api.post('/user/logout')