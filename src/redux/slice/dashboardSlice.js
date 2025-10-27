import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import { getDashboard } from '@redux/actions/dashboard';

export const fetchDashboard = asyncThunkRequest('dashboard/fetchAll', getDashboard);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    loading: false,
    data: null,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboard.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload?.data || payload;
      })
      .addCase(fetchDashboard.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload || error?.message || 'Failed to fetch dashboard data';
      });
  }
});

export default dashboardSlice.reducer;
