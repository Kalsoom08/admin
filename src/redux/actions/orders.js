import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/axiosInstance";

export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, { getState }) => {
    const { page, perPage } = getState().order;
    const response = await api.get(`/order?page=${page}&limit=${perPage}`);
    console.log("orders",response.data)
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

// export const fetchOrderStats = createAsyncThunk(
//   "order/fetchStats",
//   async () => {
//     const response = await api.get(`/order/stats`);
//         console.log(response.data)

//     return response.data; 
//   }
// );



export const fetchOrderStats = createAsyncThunk(
  "order/fetchStats",
  async () => {
    const response = await api.get(`/order/stats`);
    console.log("Response:", response.data);
    return response.data.stats;
  }
);
