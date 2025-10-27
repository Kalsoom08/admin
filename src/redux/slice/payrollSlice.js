import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import { addPayroll, deletePayroll, getAllPayroll, updatePayroll } from '@redux/actions/payroll';

export const createPayRoll = asyncThunkRequest('salary/create', body => addPayroll(body));
export const updatePayRoll = asyncThunkRequest('salary/update', ({ id, body }) => updatePayroll(id, body));
export const removePayRoll = asyncThunkRequest('salary/delete', id => deletePayroll(id));
export const fetchAllPayRoll = asyncThunkRequest('salary/fetchAll', getAllPayroll);

const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    listLoading: false,
    data: [],
    error: null,
    totalRows: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
    selectedPayRoll: null,
    filters: { search: '', status: [], month: [] }
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
      state.totalPages = Math.ceil(state.totalRows / state.perPage) || 1;
    },
    setSelectedPayRoll: (state, { payload }) => {
      state.selectedPayRoll = payload;
    },
    setFilters: (state, { payload }) => {
      state.filters = payload;
      state.page = 1;
    },
    removePayRollById: (state, { payload }) => {
      state.data = state.data.filter(p => p.salaryId !== payload);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllPayRoll.pending, state => {
        state.listLoading = true;
        state.error = null;
      })
  
     .addCase(fetchAllPayRoll.fulfilled, (state, { payload }) => {
    console.log('fetchAllPayRoll:', payload);  // Log the response for debugging
    
    state.listLoading = false;
    const salaries = payload?.salariesData || [];
    const pagination = payload?.pagination || {};

    // Update total rows and total pages
    state.totalRows = pagination.total || salaries.length;
    state.totalPages = pagination.totalPages || Math.ceil(state.totalRows / state.perPage);
   state.page = pagination.page ?? 1;

        // Directly use the employees data returned for the current page
        state.data = salaries.map(emp => ({ ...emp, userId: emp.userId || emp.id }));


})

      .addCase(fetchAllPayRoll.rejected, (state, { error }) => {
        state.listLoading = false;
        state.error = error?.message || 'Failed to fetch payroll';
      })
      .addCase(createPayRoll.fulfilled, (state, { payload }) => {
        const newItem = payload?.salariesData?.[0] || payload;
        state.data.unshift(newItem);
        state.totalRows += 1;
        state.totalPages = Math.ceil(state.totalRows / state.perPage);
      })
      .addCase(updatePayRoll.fulfilled, (state, { payload }) => {
        const updated = payload?.salariesData?.[0] || payload;
        if (!updated?.salaryId) return;
        const index = state.data.findIndex(p => p.salaryId === updated.salaryId);
        if (index !== -1) state.data[index] = { ...state.data[index], ...updated };
        else state.data.unshift(updated);
      })
      .addCase(removePayRoll.fulfilled, (state, { payload }) => {
        const removedId = payload?.salaryId || payload?.id;
        state.data = state.data.filter(p => p.salaryId !== removedId);
        if (state.totalRows > 0) state.totalRows -= 1;
        state.totalPages = Math.ceil(state.totalRows / state.perPage) || 1;
      });
  }
});

export const { setPage, setPerPage, setSelectedPayRoll, setFilters, removePayRollById } = payrollSlice.actions;
export default payrollSlice.reducer;
