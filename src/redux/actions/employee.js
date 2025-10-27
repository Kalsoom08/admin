import api from '@utils/axiosInstance';

// Add a new employee
export const addEmployee = (data) =>
  api.post('/user', data, {
    headers: { 'Content-Type': 'application/json' }
  });

// Get all employees with pagination and filters
// export const getAllEmployee = (params) => {
//   const query = new URLSearchParams();
//   if (params) {
//     if (params.page) query.append('page', params.page);
//     if (params.perPage) query.append('perPage', params.perPage);
//     if (params.search) query.append('search', params.search);

//     if (params.status && Array.isArray(params.status)) {
//       params.status.forEach((s) => query.append('status', s));
//     }

//     if (params.role && Array.isArray(params.role)) {
//       params.role.forEach((r) => query.append('role', r));
//     }
//   }
//   return api.get(`/user?${query.toString()}`);
// };
export const getAllEmployee = params => {
  const query = new URLSearchParams();
  if (params) {
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.status && Array.isArray(params.status)) {
      params.status.forEach(s => query.append('status', s));
    }
    return api.get(`/user?${query.toString()}`);
  } else {
    return api.get(`/user`);
  }
};
// Update an employee
export const updateEmployee = (id, data) =>
  api.patch(`/user/${id}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });

// Delete an employee
export const deleteEmployee = (id) => api.delete(`/user/${id}`);

// Get employee stats
export const getEmployeeStats = () => api.get('/user/stats');
