import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TextMbProvider } from "./components/ui/TextMb";
import store, { persistor } from "./lib/store";
import { queryClient } from "./lib/queryClient";
import "./i18n";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TextMbProvider>
          <App />
          {/* DevTools chỉ hiện ở development, tự ẩn ở production */}
          <ReactQueryDevtools initialIsOpen={false} />
        </TextMbProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>,
);
