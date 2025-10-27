import asyncThunkRequest from '@utils/asyncThunkRequest';
import api from '@utils/axiosInstance';

export const fetchAllSales = asyncThunkRequest('sales/fetchAll', async (params = {}) => {
  const {
    limit = 15,
    page = 1,
    items = [],
    from,
    to
  } = params;

  const query = new URLSearchParams();
  query.append('limit', limit);
  query.append('page', page);

  if (Array.isArray(items) && items.length > 0) {
    items.forEach(i => query.append('items', i));
  }

  if (from) query.append('from', from);
  if (to) query.append('to', to);

  const { data } = await api.get(`/sales?${query.toString()}`);
  console.log('✅ Raw API Response:', data);

  const formattedData = {
    data: data.items?.map(item => ({
      itemId: item.itemId,
      itemName: item.itemName,
      category: item.categoryName,
      unitSold: item.quantitySold,
      revenue: item.revenue,
      expense: item.expense
    })) || [],
    totalRecords: data.pagination?.total || 0,
    totalPages: data.pagination?.totalPages || 0,
    page: data.pagination?.page || 1
  };

  return formattedData;
});

export const fetchSalesStats = asyncThunkRequest('sales/fetchStats', async () => {
  const { data } = await api.get('/sales/stats');
  return data;
});
