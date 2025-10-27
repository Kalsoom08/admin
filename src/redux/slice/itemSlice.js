import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import { addItem, deleteItem, getAllItem, getItemOptions, updateItem } from '@redux/actions/itemAction';

export const fetchAllItem = asyncThunkRequest(
  'item/fetchAll',
  (params) => 
     getAllItem(params)
  
);

export const createItem = asyncThunkRequest('item/create', (body) => addItem(body));

export const editItem = asyncThunkRequest('item/update', ({ id, body }) =>
  updateItem(id, body)
);

export const removeItem = asyncThunkRequest('item/delete', (id) => deleteItem(id));
export const fetchItemOptions = asyncThunkRequest('item/ItemOptions', getItemOptions);
const itemSlice = createSlice({
  name: 'item',
  initialState: {
    listLoading: false,
    data: [],
    error: null,
    totalRows: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
    selectedItem: null,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    },
    setSelectedItem(state, action) {
      state.selectedItem = action.payload;
    },
       removeItemById: (state, { payload }) => {
      state.data = state.data.filter(p => p.itemId !== payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItem.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchAllItem.fulfilled, (state, { payload }) => {
        console.log('fetchAllItem fulfilled', payload);
        state.listLoading = false;

        const items = payload?.itemsData || [];
        state.data = items.map((item) => ({
          ...item,
          itemId: item.itemId || item.id,
          category: item.category || item.categoryId,
          status: item.status?.toUpperCase(),
        }));

        const pagination = payload?.pagination || {};
        state.totalRows = pagination.total || 0;
        state.page = pagination.page || 1;
        state.perPage = pagination.limit || 10;
        state.totalPages = pagination.totalPages || 1;
      })
      .addCase(fetchAllItem.rejected, (state, { payload, error }) => {
        state.listLoading = false;
        state.error = payload || error?.message || 'Failed to fetch items';
      })

    
      .addCase(createItem.fulfilled, (state, { payload }) => {
        console.log('createItem fulfilled', payload);
        const newItem = payload?.itemData || payload?.data || payload;
        //  const newItem = payload?.itemData?.[0] || payload;
        state.data.unshift(newItem);
        state.totalRows += 1;
      })

      .addCase(editItem.fulfilled, (state, { payload }) => {
        console.log('editItem fulfilled payload:', payload);

        const updated =
          payload?.itemData || payload?.data || payload?.updatedItem || payload;

        if (!updated?.itemId && updated?.id) {
          updated.itemId = updated.id;
        }

        const index = state.data.findIndex(
          (item) => item.itemId === updated.itemId
        );

        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updated };
        
        } else {
          console.warn('Updated item not found in list');
        }
      })

      .addCase(removeItem.fulfilled, (state, { payload }) => {
        console.log('removeItem fulfilled', payload);
        const removedId =
          payload?.itemId || payload?.id || payload?.data?.itemId;
        state.data = state.data.filter((item) => item.itemId !== removedId);
        if (state.totalRows > 0) state.totalRows -= 1;
      })
         .addCase(fetchItemOptions.pending, state => {
              state.actionLoading = true;
            })
            .addCase(fetchItemOptions.fulfilled, (state, { payload }) => {
              state.actionLoading = false;
           state.data = payload?.itemData;
            })
            .addCase(fetchItemOptions.rejected, state => {
              state.actionLoading = true;
            })
  },
});

export const { setPage, setPerPage, setSelectedItem,removeItemById } = itemSlice.actions;
export default itemSlice.reducer;
