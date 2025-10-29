import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import createAsyncThunk from '@utils/asyncThunkRequest';
import api from '@utils/axiosInstance';
import { errorToast } from '@utils/toastUtil';

export const fetchAllStock = createAsyncThunk(
  'stock/fetchAllStock',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      if (params.search) query.append('search', params.search);

      if (params.status && params.status.length)
        query.append('stockStatus', params.status.join(','));

      const res = await api.get(`/stock-alert?${query.toString()}`);
      return res.data;
    } catch (error) {
      const message = error.response?.data || error.message || 'Failed to fetch stock alerts';
      return rejectWithValue(message);
    }
  }
);


export const createStock = createAsyncThunk('stock/create', async body => {
  const res = await api.post('/stock-alert', body);
  console.log("creat stck ",res);
  
  return res.data?.data;
});

export const updateStockStatusAsync = asyncThunkRequest('expenses/update', async body => {
  try {
    const { alertId, ...rest } = body;
    const { data } = await api.patch(`/stock-alert/${alertId}`, {
      ...rest,
    });
    return data;
  } catch (err) {
    errorToast('Failed to update stock');
    throw err;
  }
});
// export const updateStockStatusAsync = createAsyncThunk(
//   'stock/updateStatus',
//   async ({ alertId, fulfilmentStatus, updatedBy,stockStatus }, { getState }) => {
//     const { stock } = getState();
//     const existingAlert = stock.data.find(item => item.alertId === alertId);
//     console.log("existing ",existingAlert);
    
//     if (!existingAlert) throw new Error('Alert not found');

//     const payload = {
//       itemName: existingAlert.itemName,
//       categoryId: existingAlert.categoryId,
//       price: existingAlert.price,
//       stockStatus: existingAlert.stockStatus,
//       // status: existingAlert.status || 'ACTIVE',
//       fulfilmentStatus,
//       note: `Updated by ${updatedBy}`,
//     };

//     const res = await api.patch(`/stock-alert/${alertId}`, payload);
//     return res.data?.data;
//   }
// );


export const deleteStockAlertAsync = createAsyncThunk('stock/delete', async alertId => {
  const res = await api.delete(`/stock-alert/${alertId}`);
  return { alertId, ...res.data };
});

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    listLoading: false,
    data: [],
    error: null,
    totalRows: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
    selectedStock: null,
  },

  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    },
    setSelectedStock(state, { payload }) {
      state.selectedStock = payload;
    },
    removeStockById(state, { payload }) {
      const index = state.data.findIndex(sale => sale.alertId === payload);
      if (index !== -1) state.data.splice(index, 1);
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchAllStock.pending, state => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchAllStock.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        const d = payload ?? {};
        state.data = d.alertsData ?? [];
        state.totalPages = d.pagination?.totalPages ?? 0;
        state.totalRows = d.pagination?.total ?? 0;
        state.page = d.pagination?.page ?? 1;
      })
      .addCase(fetchAllStock.rejected, (state, { payload, error }) => {
        state.listLoading = false;
        state.error = payload || error?.message || 'Failed to fetch stock';
      })
      .addCase(createStock.fulfilled, (state, { payload }) => {
        const item = payload?.alertData ?? {};
        state.data.unshift(item);
      })
      .addCase(createStock.rejected, (state, { payload, error }) => {
        state.error = payload || error?.message || 'Failed to create stock';
      })
      .addCase(updateStockStatusAsync.fulfilled, (state, { payload }) => {
        const updatedAlert = payload?.alertData;
        const index = state.data.findIndex(item => item.alertId === updatedAlert.alertId);
        if (index !== -1) state.data[index] = updatedAlert;
      })
      .addCase(updateStockStatusAsync.rejected, (state, { payload, error }) => {
        state.error = payload || error?.message || 'Failed to update stock alert';
      })
      .addCase(deleteStockAlertAsync.fulfilled, (state, { payload }) => {
        const { alertId } = payload;
        const index = state.data.findIndex(item => item.alertId === alertId);
        if (index !== -1) state.data.splice(index, 1);
      })
      .addCase(deleteStockAlertAsync.rejected, (state, { payload, error }) => {
        state.error = payload || error?.message || 'Failed to delete stock alert';
      });
  },
});

export const { setPage, setPerPage, setSelectedStock, removeStockById } = stockSlice.actions;
export default stockSlice.reducer;
