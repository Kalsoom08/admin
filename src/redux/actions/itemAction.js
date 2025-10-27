import api from '@utils/axiosInstance';

export const addItem = data =>
  api.post('/item', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getAllItem = (params) => {
  const query = new URLSearchParams();

  if (params) {
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.status) {
      // send single string or comma-separated
      query.append('status', Array.isArray(params.status) ? params.status.join(',') : params.status);
    }
    if (params.categoryId) query.append('categoryId', params.categoryId);
  }

  return api.get(`/item?${query.toString()}`);
};

export const updateItem = (id, data) =>
  api.patch(`/item/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });


export const deleteItem = id => api.delete(`/item/${id}`);

export const getItemOptions = () => api.get('/item/options');
export const getItemStats = () => api.get('/item/stats');
