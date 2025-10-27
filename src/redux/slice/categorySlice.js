import { addCategory, getAllCategory, editCategory, removeCategory, getCategoryOptions } from '@redux/actions/category';
import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
export const fetchAllCategory = asyncThunkRequest('category/fetchAll', getAllCategory);
export const createCategory = asyncThunkRequest('category/create', body => addCategory(body));
export const updateCategory = asyncThunkRequest('category/update', ({ id, body }) => editCategory(id, body));
export const deleteCategory = asyncThunkRequest('category/delete', id => removeCategory(id));
export const fetchCategoryOptions = asyncThunkRequest('category/CategoryOptions', getCategoryOptions);
const categorySlice = createSlice({
  name: 'category',
  initialState: {
    listLoading: false,
    data: [],
    error: null,
    totalRows: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
    selectedCategory: null,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    },
    setSelectedCategory(state, { payload }) {
      state.selectedCategory = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllCategory.pending, state => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategory.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        const d = payload?.categoryData || [];
        state.data = d;
        state.totalRows = d.length;
        state.totalPages = 1;
      })
      .addCase(fetchAllCategory.rejected, (state, { error }) => {
        state.listLoading = false;
        state.error = error?.message || 'Failed to fetch categories';
      })
      .addCase(createCategory.fulfilled, (state, { payload }) => {
        const newCategory = payload?.categoryData;
        if (newCategory) state.data.unshift(newCategory);
      })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        const updated = payload?.categoryData;
        if (!updated) return;
        const index = state.data.findIndex(c => c.categoryId === updated.categoryId);
        if (index !== -1) state.data[index] = updated;
      })
      .addCase(deleteCategory.fulfilled, (state, { meta }) => {
        const id = meta.arg;
        state.data = state.data.filter(c => c.categoryId !== id);
      })
        .addCase(fetchCategoryOptions.pending, state => {
        state.actionLoading = true;
      })
      .addCase(fetchCategoryOptions.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
     state.data = payload?.categoryData;
      })
      .addCase(fetchCategoryOptions.rejected, state => {
        state.actionLoading = true;
      })
  },
});
export const { setPage, setPerPage, setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;