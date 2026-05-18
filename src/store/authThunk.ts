import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services";
import type { UserData, LoginCredentials } from "../types";
import type { AppDispatch } from "./store";

export const fetchUserProfile = createAsyncThunk<UserData, string>(
  "auth/fetchUserProfile",
  async (token, { rejectWithValue }) => {
    try {
      const data = await authService.getProfile(token);
      return {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        avatar: data.image,
        dob: data.birthDate || "N/A",
        companyAddress: data.company?.address?.address || "N/A",
        homeAddress: data.address?.address || "N/A",
      } as UserData;
    } catch (err) {
      localStorage.removeItem("accessToken");
      const message = err instanceof Error ? err.message : String(err);
      return rejectWithValue(message);
    }
  },
);

export const loginUser = createAsyncThunk<
  string,
  LoginCredentials,
  { dispatch: AppDispatch }
>(
  "auth/loginUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      const token = data.accessToken || data.token;
      if (!token) throw new Error("Không nhận được token");

      localStorage.setItem("accessToken", token);
      await dispatch(fetchUserProfile(token)).unwrap();
      return token;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return rejectWithValue(message);
    }
  },
);
