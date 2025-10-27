import { createSlice } from '@reduxjs/toolkit';
import { createExpense, fetchAllExpenses, updateExpense, deleteExpense } from '../actions/expense';

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    data: [],
    totalRows: 0,
    totalPages: 0,
    page: 1,
    perPage: 10,
    listLoading: false,
    actionLoading: false,
    selectedExpense: null,
    error: null,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    },
    setSelectedExpense(state, { payload }) {
      state.selectedExpense = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllExpenses.pending, state => {
        state.listLoading = true;
      })
.addCase(fetchAllExpenses.fulfilled, (state, { payload }) => {
  state.listLoading = false;
  const d = payload?.data ?? payload;
  const expenses = d?.expensesData ?? [];

  // Normalize data so frontend always has an item name
  state.data = expenses.map(exp => {
    if (!exp.item && exp.title) {
      // create a pseudo item object to display in UI
      return {
        ...exp,
        item: { name: exp.title },
        itemName: exp.title,
      };
    }
    return {
      ...exp,
      itemName: exp.item?.name || exp.itemName || exp.title || 'N/A',
    };
  });

  state.totalPages = d?.pagination?.totalPages ?? 1;
  state.totalRows = d?.pagination?.total ?? 0;
  state.page = d?.pagination?.page ?? 1;
})

      .addCase(fetchAllExpenses.rejected, (state, { error }) => {
        state.listLoading = false;
        state.error = error?.message || 'Failed to fetch expenses';
      })
      .addCase(createExpense.pending, state => {
        state.actionLoading = true;
      })
      .addCase(createExpense.fulfilled, (state, { payload, meta }) => {
        state.actionLoading = false;
        if (payload?.expenseData) {
          const newExpense = { ...payload.expenseData };
          const customName = meta?.arg?.fakeItemName;
          if (customName) {
            newExpense.itemName = customName;
            newExpense.item = { name: customName };
          }
          state.data.unshift(newExpense);
        }
      })
      .addCase(createExpense.rejected, state => {
        state.actionLoading = false;
      })
      .addCase(updateExpense.pending, state => {
        state.actionLoading = true;
      })
      .addCase(updateExpense.fulfilled, (state, { payload, meta }) => {
        state.actionLoading = false;
        if (payload?.expenseData) {
          const updated = { ...payload.expenseData };
          const customName = meta?.arg?.fakeItemName;
          if (customName) {
            updated.itemName = customName;
            updated.item = { name: customName };
          }
          const index = state.data.findIndex(e => e.expenseId === updated.expenseId);
          if (index !== -1) state.data[index] = updated;
        }
      })
      .addCase(updateExpense.rejected, state => {
        state.actionLoading = false;
      })
      .addCase(deleteExpense.pending, state => {
        state.actionLoading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        const deletedId = payload?.expenseId || payload?.expenseData?.expenseId;
        if (deletedId) {
          state.data = state.data.filter(e => e.expenseId !== deletedId);
        }
      })
      .addCase(deleteExpense.rejected, state => {
        state.actionLoading = false;
      });
  },
});

export const { setPage, setPerPage, setSelectedExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
