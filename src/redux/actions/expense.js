import asyncThunkRequest from '@utils/asyncThunkRequest';
import api from '@utils/axiosInstance';
import { successToast, errorToast } from '@utils/toastUtil';

export const createExpense = asyncThunkRequest('expenses/create', async body => {
  try {
    const { data } = await api.post('/expense', {
      expenseId: body.expenseId || undefined,
      title: body.title,
      amount: body.amount,
      ...(body.item ? { item: body.item } : {}),
    });
    return data;
  } catch (err) {
    errorToast('Failed to add expense');
    throw err;
  }
});

export const fetchAllExpenses = asyncThunkRequest('expenses/fetchAll', async (params = {}) => {
  try {
const { limit = 10, page = 1, search = '', itemId, from, to } = params;
const searchParams = new URLSearchParams();
searchParams.append('limit', limit);
searchParams.append('page', page);
if (search) searchParams.append('search', search);
if (itemId) searchParams.append('itemId', itemId);
if (from) searchParams.append('from', from);
if (to) searchParams.append('to', to);

    const { data } = await api.get(`/expense?${searchParams.toString()}`);
    return data;
  } catch (err) {
    errorToast('Failed to fetch expenses');
    throw err;
  }
});

export const updateExpense = asyncThunkRequest('expenses/update', async body => {
  try {
    const { expenseId, ...rest } = body;
    const { data } = await api.patch(`/expense/${expenseId}`, rest);
    return data;
  } catch (err) {
    errorToast('Failed to update expense');
    throw err;
  }
});

export const deleteExpense = asyncThunkRequest('expenses/delete', async expenseId => {
  try {
    const { data } = await api.delete(`/expense/${expenseId}`);
    return { expenseId: expenseId, expenseData: data?.deletedExpense || null };
  } catch (err) {
    errorToast('Failed to delete expense');
    throw err;
  }
});
