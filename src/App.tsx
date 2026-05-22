import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { publicRoutes, protectedRoutes } from "./routes";
import AuthMiddleware from "./middleware/AuthMiddleware";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { fetchUserProfile, setUnauthenticated } from "./store/auth";
import type { AppDispatch } from "./store/store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(fetchUserProfile(token));
    } else {
      dispatch(setUnauthenticated());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout ? route.layout : Fragment;

            if (route.layout === null) {
              return (
                <Route
                  key={`pub-${index}`}
                  path={route.path}
                  element={<Page />}
                />
              );
            }

            return (
              <Route
                key={`pub-${index}`}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          <Route element={<AuthMiddleware />}>
            {protectedRoutes.map((route, index) => {
              const Page = route.component;
              const Layout = route.layout ? route.layout : Fragment;

              return (
                <Route
                  key={`priv-${index}`}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>

          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
