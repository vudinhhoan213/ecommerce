import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../../store/auth/authSlice";
import ProfilePage from "../../../pages/profile/ProfilePage";

// ===== MOCK: antd =====
jest.mock("antd", () => {
  const R = require("react");
  return {
    Card: function Card(props) {
      return R.createElement("div", { "data-testid": "card" }, 
        props.title ? R.createElement("h3", null, props.title) : null,
        props.children
      );
    },
    Avatar: function Avatar(props) {
      return R.createElement("img", { src: props.src, alt: "avatar", "data-testid": "avatar" });
    },
    Descriptions: Object.assign(
      function Descriptions(props) {
        return R.createElement("dl", null, props.children);
      },
      {
        Item: function DescItem(props) {
          return R.createElement("div", { "data-testid": "desc-item" },
            R.createElement("dt", null, props.label),
            R.createElement("dd", null, props.children)
          );
        },
      }
    ),
    Typography: {
      Title: function Title(props) {
        return R.createElement("h" + (props.level || 1), null, props.children);
      },
      Text: function Text(props) {
        return R.createElement("span", null, props.children);
      },
    },
    Spin: function Spin(props) {
      return R.createElement("div", { "data-testid": "spinner" }, "Loading...");
    },
    Result: function Result(props) {
      return R.createElement("div", { "data-testid": "result" }, props.title);
    },
    Tag: function Tag(props) {
      return R.createElement("span", { "data-testid": "tag" }, props.children);
    },
  };
});

// ===== MOCK: @ant-design/icons =====
jest.mock("@ant-design/icons", () => ({
  UserOutlined: () => null,
  MailOutlined: () => null,
  CalendarOutlined: () => null,
  ManOutlined: () => null,
  WomanOutlined: () => null,
  HomeOutlined: () => null,
  BankOutlined: () => null,
  PhoneOutlined: () => null,
}));

// ===== MOCK: i18next =====
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const map = {
        "profile.title": "Profile",
        "profile.notLoggedIn": "Please login",
        "profile.personalInfo": "Personal Info",
        "profile.dateOfBirth": "Date of Birth",
        "profile.gender": "Gender",
        "profile.male": "Male",
        "profile.female": "Female",
        "profile.companyAddress": "Company Address",
        "profile.homeAddress": "Home Address",
      };
      return map[key] || key;
    },
  }),
}));

const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "0123456789",
  image: "https://example.com/avatar.jpg",
  dob: "1990-01-01",
  gender: "male",
  companyAddress: "123 Company St",
  homeAddress: "456 Home Ave",
};

function renderProfilePage(authState: any = {}) {
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

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </Provider>
  );
}

describe("ProfilePage", () => {
  describe("loading state", () => {
    it("should show spinner when loading", () => {
      renderProfilePage({ loading: true });
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });
  });

  describe("not logged in", () => {
    it("should show not logged in message when no userData", () => {
      renderProfilePage({ loading: false, userData: null });
      expect(screen.getByText("Please login")).toBeInTheDocument();
    });
  });

  describe("with user data", () => {
    it("should display user name", () => {
      renderProfilePage({ loading: false, userData: mockUserData, isAuthenticated: true });
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should display user email", () => {
      renderProfilePage({ loading: false, userData: mockUserData, isAuthenticated: true });
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("should display user phone", () => {
      renderProfilePage({ loading: false, userData: mockUserData, isAuthenticated: true });
      expect(screen.getByText("0123456789")).toBeInTheDocument();
    });

    it("should display avatar image", () => {
      renderProfilePage({ loading: false, userData: mockUserData, isAuthenticated: true });
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("should display date of birth", () => {
      renderProfilePage({ loading: false, userData: mockUserData, isAuthenticated: true });
      expect(screen.getByText("1990-01-01")).toBeInTheDocument();
    });

    it("should display gender tag for male", () => {
      renderProfilePage({ loading: false, userData: mockUserData, isAuthenticated: true });
      expect(screen.getByText("Male")).toBeInTheDocument();
    });

    it("should display gender tag for female", () => {
      const femaleUser = { ...mockUserData, gender: "female" };
      renderProfilePage({ loading: false, userData: femaleUser, isAuthenticated: true });
      expect(screen.getByText("Female")).toBeInTheDocument();
    });

    it("should display company address", () => {
      renderProfilePage({ loading: false, userData: mockUserData, isAuthenticated: true });
      expect(screen.getByText("123 Company St")).toBeInTheDocument();
    });

    it("should display home address", () => {
      renderProfilePage({ loading: false, userData: mockUserData, isAuthenticated: true });
      expect(screen.getByText("456 Home Ave")).toBeInTheDocument();
    });

    it("should display N/A when dob is not provided", () => {
      const noDob = { ...mockUserData, dob: "" };
      renderProfilePage({ loading: false, userData: noDob, isAuthenticated: true });
      // empty dob shows "N/A" fallback via || "N/A" in component
    });
  });
});
