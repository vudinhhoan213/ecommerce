import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../store/auth/authSlice";
import { useRequireAuth } from "../../hooks/useRequireAuth";

// Test component that uses the hook
function TestComponent({ onAction }: { onAction: () => void }) {
  const requireAuth = useRequireAuth();

  return (
    <button onClick={() => requireAuth(onAction)}>
      Do Action
    </button>
  );
}

function renderWithAuth(isAuthenticated: boolean, onAction: jest.Mock, initialRoute = "/shop") {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        userData: isAuthenticated ? { name: "Test" } : null,
        loading: false,
        isAuthenticated,
        loginLoading: false,
        loginError: "",
      },
    },
  });

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/shop" element={<TestComponent onAction={onAction} />} />
          <Route path="/shop/:slug" element={<TestComponent onAction={onAction} />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return { user };
}

describe("useRequireAuth", () => {
  it("should call callback when user is authenticated", async () => {
    const onAction = jest.fn();
    const { user } = renderWithAuth(true, onAction);

    await user.click(screen.getByText("Do Action"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("should redirect to login when user is not authenticated", async () => {
    const onAction = jest.fn();
    const { user } = renderWithAuth(false, onAction);

    await user.click(screen.getByText("Do Action"));
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("should not call callback when not authenticated", async () => {
    const onAction = jest.fn();
    const { user } = renderWithAuth(false, onAction);

    await user.click(screen.getByText("Do Action"));
    expect(onAction).not.toHaveBeenCalled();
  });
});
