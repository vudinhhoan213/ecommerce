import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";

// Cấu hình persist cho cart (giữ giỏ hàng khi reload)
const cartPersistConfig = {
  key: "cart",
  storage,
};

// Cấu hình persist cho auth (giữ token + user data)
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["userData", "isAuthenticated"], // Chỉ persist những field này
};

const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    cart: persistReducer(cartPersistConfig, cartReducer),
    product: productReducer, // Không persist — fetch mới mỗi lần vào trang
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua các action của redux-persist (không serialize được)
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
