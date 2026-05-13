import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import AuthMiddleware from "./middleware/AuthMiddleware";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {publicRoutes.map((route, index) => {
                const Page = route.component;
                const Layout = route.layout ? route.layout : Fragment;

                // Login route không cần auth
                if (route.path === "/") {
                  return (
                    <Route key={index} path={route.path} element={<Page />} />
                  );
                }

                // Protected routes cần auth
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
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
