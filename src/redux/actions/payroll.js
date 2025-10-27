import api from '@utils/axiosInstance';


export const addPayroll = data =>
  api.post('/salary', data, {
    headers: { 'Content-Type': 'application/json' }
  });


export const updatePayroll = (id, data) =>
  api.patch(`/salary/${id}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });


export const deletePayroll = id => api.delete(`/salary/${id}`);


export const getAllPayroll = params => {
  const query = new URLSearchParams();
  if (params) {
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
      if (params?.month?.length) params.month.forEach(m => query.append('month', m));
    if (params.status && Array.isArray(params.status)) {
      params.status.forEach(s => query.append('status', s));
    }
  const queryString = query.toString();

  // Log the query string to check it
  console.log("Generated API Query String:", queryString);
    return api.get(`/salary?${query.toString()}`);
  } else {
    return api.get(`/salary`);
  }

}