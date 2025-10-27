import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorToast } from '@utils/toastUtil';

function asyncThunkRequest(typePrefix, callback) {
  return createAsyncThunk(typePrefix, async (args, thunkAPI) => {
    try {
      const response = await callback(args, thunkAPI);

      if (response?.data) {
        return response.data.data || response.data;
      }
      return response;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Something went wrong';
      errorToast(message);
      return thunkAPI.rejectWithValue(message);
    }
  });
}

export default asyncThunkRequest;
