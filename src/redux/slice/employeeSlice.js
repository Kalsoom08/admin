import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import { addEmployee, deleteEmployee, getAllEmployee, updateEmployee, getEmployeeStats } from '@redux/actions/employee';

export const fetchAllEmployee = asyncThunkRequest('employee/fetchAll', params => getAllEmployee(params));
export const createEmployee = asyncThunkRequest('employee/create', body => addEmployee(body));
export const editEmployee = asyncThunkRequest('employee/update', ({ id, body }) => updateEmployee(id, body));
export const removeEmployee = asyncThunkRequest('employee/delete', id => deleteEmployee(id));
export const fetchEmployeeStats = asyncThunkRequest('employee/fetchStats', getEmployeeStats);

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    listLoading: false,
    data: [],
    error: null,
    totalRows: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
    selectedEmployee: null,
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      resignedUsers: 0,
      blockedUsers: 0
    },
    statsLoading: false
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
      // state.totalPages = Math.ceil(state.totalRows / state.perPage) || 1;
    },
    setSelectedEmployee(state, action) {
      state.selectedEmployee = action.payload;
    },
    removeEmployeeById(state, { payload }) {
      const index = state.data.findIndex(emp => emp.userId === payload);
      if (index !== -1) state.data.splice(index, 1);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllEmployee.pending, state => {
        state.listLoading = true;
      })
      .addCase(fetchAllEmployee.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        const employees = payload?.usersData || [];
        const pagination = payload?.pagination || {};

        // Use pagination from backend, not manual calculation
        state.totalRows = pagination.totalRecords ?? employees.length;
        state.totalPages = pagination.totalPages ?? Math.ceil(state.totalRows / state.perPage);
        state.page = pagination.page ?? 1;

        // Directly use the employees data returned for the current page
        state.data = employees.map(emp => ({ ...emp, userId: emp.userId || emp.id }));
      })

      // .addCase(fetchAllEmployee.fulfilled, (state, { payload }) => {
      //         console.log('fetchAllItem fulfilled', payload);
      //         state.listLoading = false;

      //         const employees = payload?.usersData || [];
      //         state.data = employees.map((item) => ({
      //           ...item,
      //           itemId: item.itemId || item.id,
      //           category: item.category || item.categoryId,
      //           status: item.status?.toUpperCase(),
      //         }));

      //         const pagination = payload?.pagination || {};
      //         state.totalRows = pagination.total || 0;
      //         state.page = pagination.page || 1;
      //         state.perPage = pagination.limit || 10;
      //         state.totalPages = pagination.totalPages || 1;
      //       })
      .addCase(fetchAllEmployee.rejected, (state, { payload, error }) => {
        state.listLoading = false;
        state.error = payload || error?.message || 'Failed to fetch employees';
      })
      .addCase(createEmployee.fulfilled, (state, { payload }) => {
        const newEmp = payload?.userData || payload?.data || payload;
        if (newEmp) {
          state.data.unshift(newEmp);
          state.totalRows += 1;
          state.totalPages = Math.ceil(state.totalRows / state.perPage);
        }
      })
      .addCase(editEmployee.fulfilled, (state, { payload }) => {
        const updated = payload?.userData || payload;
        const index = state.data.findIndex(emp => emp.userId === updated.userId);
        if (index !== -1) state.data[index] = { ...state.data[index], ...updated };
      })
      .addCase(removeEmployee.fulfilled, (state, { payload }) => {
        const removedId = payload?.userId || payload?.id || payload?.data?.userId;
        state.data = state.data.filter(emp => emp.userId !== removedId);
        if (state.totalRows > 0) state.totalRows -= 1;
        state.totalPages = Math.ceil(state.totalRows / state.perPage);
      })
      .addCase(fetchEmployeeStats.pending, state => {
        state.statsLoading = true;
      })
      .addCase(fetchEmployeeStats.fulfilled, (state, { payload }) => {
        state.statsLoading = false;
        state.stats = payload?.stats || state.stats;
      })
      .addCase(fetchEmployeeStats.rejected, (state, { payload, error }) => {
        state.statsLoading = false;
        state.error = payload || error?.message || 'Failed to fetch employee stats';
      });
  }
});

export const { setPage, setPerPage, setSelectedEmployee, removeEmployeeById } = employeeSlice.actions;
export default employeeSlice.reducer;
