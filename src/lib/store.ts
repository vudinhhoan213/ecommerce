import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
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
import storage from "redux-persist/lib/storage";
import { authReducer } from "../features/auth";
import { cartReducer } from "../features/cart";
import { productReducer, searchSuggestReducer } from "../features/shop";
import { rootEpic } from "./rootEpic";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  product: productReducer,
  searchSuggest: searchSuggestReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export default store;
