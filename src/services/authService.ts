import httpClient from "./httpClient";
import type { ApiUserData, LoginCredentials, LoginResponse } from "../types";

const authService = {
  login: (credentials: LoginCredentials): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>("/auth/login", {
      username: credentials.username.trim(),
      password: credentials.password.trim(),
      expiresInMins: 30,
    });
  },

  getProfile: (token: string): Promise<ApiUserData> => {
    return httpClient.get<ApiUserData>("/auth/me", token);
  },
};

export default authService;
