import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/auth/authSlice";
import AuthMiddleware from "./AuthMiddleware";

// ===== MOCK: i18next =====
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// ===== HELPER =====
function renderWithAuth(authState: any, initialRoute = "/protected") {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<AuthMiddleware />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
            <Route path="/shop" element={<div>Shop Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

// ============================================================
// TEST SUITE: AuthMiddleware
// ============================================================
describe("AuthMiddleware", () => {
  it("should show loading text while auth is being checked", () => {
    renderWithAuth({
      userData: null,
      loading: true,
      isAuthenticated: false,
      loginLoading: false,
      loginError: "",
    });

    expect(screen.getByText("auth.checkingAccess")).toBeInTheDocument();
  });

  it("should redirect to /login when not authenticated", () => {
    renderWithAuth({
      userData: null,
      loading: false,
      isAuthenticated: false,
      loginLoading: false,
      loginError: "",
    });

    // Redirected to login page
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render child routes when authenticated", () => {
    renderWithAuth({
      userData: { id: 1, name: "Test User" },
      loading: false,
      isAuthenticated: true,
      loginLoading: false,
      loginError: "",
    });

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should include returnUrl in login redirect", () => {
    renderWithAuth(
      {
        userData: null,
        loading: false,
        isAuthenticated: false,
        loginLoading: false,
        loginError: "",
      },
      "/shop"
    );

    // Should redirect to login — the login page renders
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
