import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfile, loginUser } from "./authThunk";
import type { AuthState } from "../types";
import { PURGE } from "redux-persist";

const initialState: AuthState = {
  userData: null,
  loading: true,
  isAuthenticated: false,
  loginLoading: false,
  loginError: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Xóa token khỏi localStorage (token không persist vì không nằm trong whitelist)
      localStorage.removeItem("accessToken");
      state.userData = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    clearLoginError: (state) => {
      state.loginError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Reset state khi purge persist
      .addCase(PURGE, () => initialState)
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = "";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loginLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload as string;
      });
  },
});

export const { logout, clearLoginError } = authSlice.actions;
export default authSlice.reducer;
