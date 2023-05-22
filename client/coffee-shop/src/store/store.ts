import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import applicationReducer from "./App/applicationSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch } from "react-redux";
import themeReducer from "./Theme/themeSlice";
import authenticateReducer from "./Authenticate/authenticateSlice";
import menuReducer from "./Menu/menuSlice";
const rootReducerConfig = {
  key: "frontend-root",
  storage,
  whitelist: ["theme"],
};

const reducers = combineReducers({
  theme: themeReducer,
  application: applicationReducer,
  auth: authenticateReducer,
  menu: menuReducer,
});

const persistedReducer = persistReducer(rootReducerConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
let persistor = persistStore(store);

const storeProvider = { persistor, store };

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default storeProvider;
export const useAppDispatch = () => useDispatch<AppDispatch>();
