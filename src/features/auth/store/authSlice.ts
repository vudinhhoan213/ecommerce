import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, UserData, LoginCredentials } from "../../../types";

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
    // --- FETCH USER PROFILE ---
    fetchUserProfile: (state, _action: PayloadAction<string>) => {
      state.loading = true;
    },
    fetchUserProfileSuccess: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    fetchUserProfileFailed: (state, _action: PayloadAction<string>) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    // --- LOGIN ---
    loginUser: (state, _action: PayloadAction<LoginCredentials>) => {
      state.loginLoading = true;
      state.loginError = "";
    },
    loginUserSuccess: (state, _action: PayloadAction<string>) => {
      state.loginLoading = false;
    },
    loginUserFailed: (state, action: PayloadAction<string>) => {
      state.loginLoading = false;
      state.loginError = action.payload;
    },

    // --- UTILITIES ---
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
});

export const {
  fetchUserProfile,
  fetchUserProfileSuccess,
  fetchUserProfileFailed,
  loginUser,
  loginUserSuccess,
  loginUserFailed,
  logout,
  setUnauthenticated,
  clearLoginError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
export default authSlice.reducer;
