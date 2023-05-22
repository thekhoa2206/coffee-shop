import React, { Suspense, useEffect, useMemo } from "react";
import { render } from "react-dom";
import reportWebVitals from "reportWebVitals";
import App from "./App";
import ReactDOM from "react-dom/client";
import storeProvider from "store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CookiesProvider } from "react-cookie";
import LoadingAuth from "components/Loading/LoadingAuth";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "theme";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={storeProvider.store}>
      <PersistGate loading={null} persistor={storeProvider.persistor}>
      <Suspense fallback={<LoadingAuth />}>
          <CookiesProvider>
              <App />
            </CookiesProvider>
        </Suspense>
      </PersistGate>
    </Provider>
);
reportWebVitals();


