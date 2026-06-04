import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../../store/auth/authSlice";
import LoginPage from "../../../pages/login/LoginPage";
import { loginUserFailed } from "../../../store/auth/authSlice";

// ===== MOCK: antd =====
jest.mock("antd", () => {
  const R = require("react");

  const FormContext = R.createContext({});

  function FormComp(props) {
    const formRef = R.useRef({});

    const setFieldValue = (name, value) => {
      formRef.current[name] = value;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (props.onFinish) props.onFinish(formRef.current);
    };

    return R.createElement(
      FormContext.Provider,
      { value: { setFieldValue } },
      R.createElement("form", { onSubmit: handleSubmit }, props.children)
    );
  }

  FormComp.Item = function FormItem(props) {
    const { setFieldValue } = R.useContext(FormContext);

    const child = R.Children.only(props.children);
    const cloned = R.cloneElement(child, {
      onChange: (e) => {
        const val = e && e.target ? e.target.value : e;
        if (setFieldValue && props.name) setFieldValue(props.name, val);
      },
    });

    return R.createElement(
      "div",
      null,
      props.label ? R.createElement("label", null, props.label) : null,
      cloned
    );
  };

  const InputComp = R.forwardRef(function InputComp(props, ref) {
    return R.createElement("input", {
      placeholder: props.placeholder,
      onChange: props.onChange,
      ref: ref,
    });
  });

  // Input.Password
  const PasswordComp = R.forwardRef(function PasswordComp(props, ref) {
    return R.createElement("input", {
      type: "text",
      placeholder: props.placeholder,
      onChange: props.onChange,
      ref: ref,
    });
  });
  InputComp["Password"] = PasswordComp;

  function ButtonComp(props) {
    return R.createElement(
      "button",
      { type: props.htmlType || "button", disabled: props.loading },
      props.children
    );
  }

  function AlertComp(props) {
    return R.createElement("div", { role: "alert" }, props.message);
  }

  return {
    Form: FormComp,
    Input: InputComp,
    Button: ButtonComp,
    Alert: AlertComp,
  };
});

// ===== MOCK: i18next =====
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, opts) => {
      const map = {
        "auth.title": "Login",
        "auth.username": "Username",
        "auth.loginButton": "Login",
        "auth.usernameRequired": "Please enter username",
        "auth.passwordRequired": "Please enter password",
        "auth.usernamePlaceholder": "Enter username",
        "auth.passwordPlaceholder": "Enter password",
      };
      map["auth.password"] = "Password";
      return map[key] || key;
    },
  }),
}));

// ===== HELPER =====
function renderLoginPage(authState: any = {}, initialRoute = "/login") {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        userData: null,
        loading: false,
        isAuthenticated: false,
        loginLoading: false,
        loginError: "",
        ...authState,
      },
    },
  });

  const user = userEvent.setup();

  const utils = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shop" element={<div>Shop Page</div>} />
          <Route path="/cart" element={<div>Cart Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return { store, user, container: utils.container };
}

// ============================================================
// TEST SUITE: LoginPage
// ============================================================
describe("LoginPage", () => {
  describe("rendering", () => {
    it("should render login form with title", () => {
      renderLoginPage();
      expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    });

    it("should render username input field", () => {
      renderLoginPage();
      expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
    });

    it("should render password input field", () => {
      renderLoginPage();
      expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    });

    it("should render login button", () => {
      renderLoginPage();
      expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    });

    it("should render nothing when auth is loading", () => {
      const { container } = renderLoginPage({ loading: true });
      expect(container.innerHTML).toBe("");
    });
  });

  describe("redirect when authenticated", () => {
    it("should redirect to /shop when already authenticated", () => {
      renderLoginPage({ isAuthenticated: true });
      expect(screen.getByText("Shop Page")).toBeInTheDocument();
    });

    it("should redirect to returnUrl when already authenticated", () => {
      renderLoginPage({ isAuthenticated: true }, "/login?returnUrl=/cart");
      expect(screen.getByText("Cart Page")).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("should dispatch loginUser action on submit", async () => {
      const { store, user } = renderLoginPage();

      const usernameInput = screen.getByPlaceholderText("Enter username");
      const passwordInput = screen.getByPlaceholderText("Enter password");
      const submitBtn = screen.getByRole("button", { name: /Login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "mypass123");
      await user.click(submitBtn);

      await waitFor(() => {
        const state = store.getState().auth;
        expect(state.loginLoading).toBe(true);
        expect(state.loginError).toBe("");
      });
    });
  });

  describe("error display", () => {
    it("should display login error message", async () => {
      const { store } = renderLoginPage();

      // Simulate error arriving after mount (like epic returning error)
      store.dispatch(loginUserFailed("Invalid credentials"));

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    it("should not display error alert when loginError is empty", () => {
      renderLoginPage({ loginError: "" });
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("clear error on mount", () => {
    it("should clear loginError on mount via useEffect", () => {
      const { store } = renderLoginPage({ loginError: "Old error" });
      expect(store.getState().auth.loginError).toBe("");
    });
  });
});
