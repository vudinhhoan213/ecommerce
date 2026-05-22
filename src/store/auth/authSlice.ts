import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../../types";
import {
  fetchUserProfile,
  fetchUserProfileSuccess,
  fetchUserProfileFailed,
  loginUser,
  loginUserSuccess,
  loginUserFailed,
} from "../epics/authEpic";

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
      localStorage.removeItem("accessToken");
      state.userData = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setUnauthenticated: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userData = null;
    },
    clearLoginError: (state) => {
      state.loginError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfileSuccess, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserProfileFailed, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Login
      .addCase(loginUser, (state) => {
        state.loginLoading = true;
        state.loginError = "";
      })
      .addCase(loginUserSuccess, (state) => {
        state.loginLoading = false;
      })
      .addCase(loginUserFailed, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      });
  },
});

export const { logout, setUnauthenticated, clearLoginError } =
  authSlice.actions;
export default authSlice.reducer;
