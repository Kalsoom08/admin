import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import api from '@utils/axiosInstance';

export const fetchAllSales = asyncThunkRequest(
  'sales/fetchAll',
  async ({ page = 1, limit = 10, items = [], fromDate, toDate } = {}) => {
    const params = { page, limit };

    
    if (Array.isArray(items) && items.length > 0) {
      params.items = items.map(i => i.value || i); 
    }

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const res = await api.get('/sales', {
      params,
      paramsSerializer: p =>
        new URLSearchParams(
          Object.entries(p).flatMap(([key, value]) =>
            Array.isArray(value)
              ? value.map(v => [key, v])
              : [[key, value]]
          )
        ).toString(),
    });

    const { items: salesItems = [], pagination = {} } = res.data;

    return {
      salesData: salesItems.map(i => ({
        itemId: i.itemId,
        itemName: i.itemName,
        category: i.categoryName,
        unitSold: i.quantitySold,
        revenue: i.revenue,
        expense: i.expense
      })),
      totalRecords: pagination.total || salesItems.length,
      totalPages: pagination.totalPages || 1,
      page: pagination.page || 1
    };
  }
);


export const fetchSalesStats = asyncThunkRequest('sales/fetchStats', async () => {
  const res = await api.get(`/sales/stats`);
  const { stats = {}, analytics = {} } = res.data;
  return {
    totalSale: stats.totalSale,
    saleThisMonth: stats.saleThisMonth,
    todaySale: stats.todaySale,
    lowestSellingItem: stats.lowestSellingItem,
    analytics
  };
});

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    listLoading: false,
    statsLoading: false,
    data: [],
    error: null,
    totalRows: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
    stats: null
  },
  reducers: {
    setPage: (state, action) => { state.page = action.payload; },
    setPerPage: (state, action) => { state.perPage = action.payload; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllSales.pending, state => { state.listLoading = true; state.error = null; })
      .addCase(fetchAllSales.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.data = payload.salesData ?? [];
        state.totalRows = payload.totalRecords ?? 0;
        state.totalPages = payload.totalPages ?? 0;
        state.page = payload.page ?? 1;
      })
      .addCase(fetchAllSales.rejected, (state, { payload, error }) => {
        state.listLoading = false;
        state.error = payload || error?.message || 'Failed to fetch sales';
      })
      .addCase(fetchSalesStats.pending, state => { state.statsLoading = true; })
      .addCase(fetchSalesStats.fulfilled, (state, { payload }) => {
        state.statsLoading = false;
        state.stats = payload ?? null;
      })
      .addCase(fetchSalesStats.rejected, (state, { payload, error }) => {
        state.statsLoading = false;
        state.error = payload || error?.message || 'Failed to fetch sales stats';
      });
  }
});

export const { setPage, setPerPage } = salesSlice.actions;
export default salesSlice.reducer;
