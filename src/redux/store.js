// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@redux/slice/authSlice';
import { attachStore } from '@utils/axiosInstance';
import expensesSlice from '@redux/slice/expensesSlice';
import salesSlice from '@redux/slice/salesSlice';
import employeeSlice from '@redux/slice/employeeSlice';
import payrollSlice from '@redux/slice/payrollSlice';
import categorySlice from '@redux/slice/categorySlice';
import itemSlice from '@redux/slice/itemSlice';
import stockSlice from '@redux/slice/stockSlice';
import dashboardSlice from '@redux/slice/dashboardSlice'
import orderSlice from '@redux/slice/orderSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    expenses: expensesSlice,
    sales: salesSlice,
    employee:employeeSlice,
    payroll:payrollSlice,
    category:categorySlice,
    item:itemSlice,
    stock:stockSlice,
    dashboard:dashboardSlice,
    order: orderSlice
  }
});

attachStore(store);
export default store;
