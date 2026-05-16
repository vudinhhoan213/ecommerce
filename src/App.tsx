import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { publicRoutes } from "./routes";
import AuthMiddleware from "./middleware/AuthMiddleware";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { fetchUserProfile } from "./store/authThunk";
import type { AppDispatch } from "./store/store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(fetchUserProfile(token));
    } else {
      dispatch({ type: "auth/fetchUserProfile/rejected" });
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout ? route.layout : Fragment;

            if (route.path === "/") {
              return <Route key={index} path={route.path} element={<Page />} />;
            }

            return (
              <Route key={index} element={<AuthMiddleware />}>
                <Route
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              </Route>
            );
          })}
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
