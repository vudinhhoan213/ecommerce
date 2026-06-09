import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { publicRoutes, protectedRoutes } from "./config/routes";
import { AuthMiddleware, appInit } from "./features/auth";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import type { AppDispatch } from "./lib/store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(appInit());
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
