import { login, logout } from '@redux/actions/auth';
import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
export const signIn = asyncThunkRequest('auth/signin', body => login(body));
export const userLogout = asyncThunkRequest('auth/logout', logout);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    data: null,
    error: null
  },
  reducers: {
    forceLogout: state => {
      state.isLoggedIn = false;
      state.data = null;
      state.error = null;
    },
    setUserLogin: (state, { payload }) => {
      state.isLoggedIn = true;
      state.data = payload.userData;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.data = payload.userData;
      })
      .addCase(signIn.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload || error?.message || 'Something went wrong';
      })
      .addCase(userLogout.fulfilled, state => {
        state.isLoggedIn = false;
        state.data = null;
      });
  }
});
export const { forceLogout, setUserLogin } = authSlice.actions;
export default authSlice.reducer;