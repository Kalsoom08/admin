import { createSlice } from "@reduxjs/toolkit";
import { fetchAllOrders, deleteOrder, fetchOrderStats } from "../actions/orders";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: [],
    listLoading: false,
    totalRows: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
    selectedOrder: null,
    stats: {},
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.listLoading = true;
      })
.addCase(fetchAllOrders.fulfilled, (state, action) => {
  state.listLoading = false;
  const payload = action.payload || {};
  state.data = payload.orders ?? [];
  state.totalRows = payload.pagination?.total ?? 0;
  state.totalPages = payload.pagination?.totalPages ?? 1;
})

      .addCase(fetchAllOrders.rejected, (state) => {
        state.listLoading = false;
        state.data = [];
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (order) => order.orderId !== action.payload
        );
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload || {};
      });
  },
});

export const { setPage, setPerPage, setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
