import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import api from '@utils/axiosInstance'; 

export const fetchAllSales = asyncThunkRequest('sales/fetchAll', async ({ page = 1, limit = 10 } = {}) => {
  const res = await api.get(`/sales`, { params: { page, limit } });
  const { items = [], pagination = {} } = res.data;

  return {
    salesData: items.map(i => ({
      itemId: i.itemId,
      itemName: i.itemName,
      category: i.categoryName,
      unitSold: i.quantitySold,
      revenue: i.revenue,
      expense: i.expense
    })),
    totalRecords: pagination.total || items.length,
    totalPages: pagination.totalPages || 1,
    page: pagination.page || 1
  };
});

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
    stats: null,
    selectedSales: null
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    setSelectedSales: (state, { payload }) => {
      state.selectedSales = payload;
    },
    removeSalesById: (state, { payload }) => {
      const index = state.data.findIndex(sale => sale.itemId === payload);
      if (index !== -1) state.data.splice(index, 1);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllSales.pending, state => {
        state.listLoading = true;
        state.error = null;
      })
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

      .addCase(fetchSalesStats.pending, state => {
        state.statsLoading = true;
      })
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

export const { setPage, setPerPage, setSelectedSales, removeSalesById } = salesSlice.actions;
export default salesSlice.reducer;
