import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/axiosInstance";

// @redux/actions/orders.js
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async ({ page, perPage, search, paymentMethods, status }, { getState }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", perPage);
    if (search) params.append("search", search);
    if (status?.length) params.append("status", status.join(",")); // optional: status filter
    if (paymentMethods?.length) params.append("paymentMethod", paymentMethods.join(",")); // backend expects comma-separated

    const response = await api.get(`/order?${params.toString()}`);
    return response.data;
  }
);


export const deleteOrder = createAsyncThunk(
  "order/delete",
  async (orderId) => {
    await api.delete(`/order/${orderId}`);
    return orderId;
  }
);

export const fetchOrderStats = createAsyncThunk(
  "order/fetchStats",
  async () => {
    const response = await api.get(`/order/stats`);
    return response.data.stats;
  }
);
