import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import { addCategory, getAllCategory, editCategory, removeCategory, getCategoryOptions } from '@redux/actions/category';

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
    totalPages: 1,
    selectedCategory: null,
  },
  reducers: {
    setPage(state, action) { state.page = action.payload; },
    setPerPage(state, action) { state.perPage = action.payload; state.page = 1; },
    setSelectedCategory(state, { payload }) { state.selectedCategory = payload; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllCategory.pending, state => { state.listLoading = true; state.error = null; })
      .addCase(fetchAllCategory.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.data = payload.categoryData || [];
        state.totalRows = payload.pagination?.total || payload.categoryData.length || 0;
        state.totalPages = payload.pagination?.totalPages || 1;
      })
      .addCase(fetchAllCategory.rejected, (state, { error }) => { state.listLoading = false; state.error = error?.message || 'Failed to fetch categories'; })
      .addCase(createCategory.fulfilled, (state, { payload }) => { if (payload.categoryData) state.data.unshift(payload.categoryData); })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        const updated = payload?.categoryData;
        if (!updated) return;
        const index = state.data.findIndex(c => c.categoryId === updated.categoryId);
        if (index !== -1) state.data[index] = updated;
      })
      .addCase(deleteCategory.fulfilled, (state, { meta }) => { state.data = state.data.filter(c => c.categoryId !== meta.arg); });
  }
});

export const { setPage, setPerPage, setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
