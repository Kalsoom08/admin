import api from '@utils/axiosInstance';


export const addCategory = data =>
  api.post('/category', data, { headers: { 'Content-Type': 'multipart/form-data' } });


export const editCategory = (id, data) =>
  api.patch(`/category/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });


export const getAllCategory = ({ page = 1, limit = 10, search = '', status = '' } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  return api.get(`/category?${params.toString()}`);
};


export const removeCategory = id => api.delete(`/category/${id}`);

export const getCategoryOptions = () => api.get('/category/options');
