import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/axiosInstance";

export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async ({ page, perPage, search, paymentMethods }, { getState }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", perPage);
    if (search) params.append("search", search);
    if (paymentMethods?.length) params.append("paymentMethods", paymentMethods.join(","));

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
