import authReducer, {
  logout,
  setUnauthenticated,
  clearLoginError,
} from "../../../store/auth/authSlice";
import {
  fetchUserProfile,
  fetchUserProfileSuccess,
  fetchUserProfileFailed,
  loginUser,
  loginUserSuccess,
  loginUserFailed,
} from "../../../store/auth/authSlice";
import type { AuthState, UserData } from "../../../types";

// ===== MOCK DATA =====
const mockUserData: UserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  image: "avatar.jpg",
  gender: "male",
  name: "John Doe",
  avatar: "avatar.jpg",
  dob: "1990-01-01",
  companyAddress: "123 Company St",
  homeAddress: "456 Home Ave",
};

const initialState: AuthState = {
  userData: null,
  loading: true,
  isAuthenticated: false,
  loginLoading: false,
  loginError: "",
};

// ============================================================
// TEST SUITE: authSlice
// ============================================================
describe("authSlice", () => {
  // ──────────────────────────────────────────────────────────
  // Local reducers
  // ──────────────────────────────────────────────────────────
  describe("logout", () => {
    it("should clear user data and set unauthenticated", () => {
      const loggedInState: AuthState = {
        ...initialState,
        userData: mockUserData,
        isAuthenticated: true,
        loading: false,
      };

      const state = authReducer(loggedInState, logout());

      expect(state.userData).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });
  });

  describe("setUnauthenticated", () => {
    it("should set loading=false, isAuthenticated=false, userData=null", () => {
      const state = authReducer(initialState, setUnauthenticated());

      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.userData).toBeNull();
    });
  });

  describe("clearLoginError", () => {
    it("should clear loginError string", () => {
      const stateWithError: AuthState = {
        ...initialState,
        loginError: "Invalid credentials",
      };

      const state = authReducer(stateWithError, clearLoginError());

      expect(state.loginError).toBe("");
    });
  });

  // ──────────────────────────────────────────────────────────
  // extraReducers (actions from epics)
  // ──────────────────────────────────────────────────────────
  describe("fetchUserProfile flow", () => {
    it("should set loading=true on fetchUserProfile", () => {
      const state = authReducer(initialState, fetchUserProfile("token123"));

      expect(state.loading).toBe(true);
    });

    it("should set user data on fetchUserProfileSuccess", () => {
      const state = authReducer(
        initialState,
        fetchUserProfileSuccess(mockUserData),
      );

      expect(state.userData).toEqual(mockUserData);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it("should clear user data on fetchUserProfileFailed", () => {
      const loggedInState: AuthState = {
        ...initialState,
        userData: mockUserData,
        isAuthenticated: true,
      };

      const state = authReducer(
        loggedInState,
        fetchUserProfileFailed("Network error"),
      );

      expect(state.userData).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });
  });

  describe("loginUser flow", () => {
    it("should set loginLoading=true on loginUser", () => {
      const state = authReducer(
        initialState,
        loginUser({ username: "test", password: "pass" }),
      );

      expect(state.loginLoading).toBe(true);
      expect(state.loginError).toBe("");
    });

    it("should set loginLoading=false on loginUserSuccess", () => {
      const loadingState: AuthState = {
        ...initialState,
        loginLoading: true,
      };

      const state = authReducer(loadingState, loginUserSuccess("token123"));

      expect(state.loginLoading).toBe(false);
    });

    it("should set loginError on loginUserFailed", () => {
      const loadingState: AuthState = {
        ...initialState,
        loginLoading: true,
      };

      const state = authReducer(
        loadingState,
        loginUserFailed("Invalid username or password"),
      );

      expect(state.loginLoading).toBe(false);
      expect(state.loginError).toBe("Invalid username or password");
    });
  });
});
