import { HeaderLink } from "shared/model/routing/route.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationState } from "./types";
import { createTheme } from "theme";

const initialState: ApplicationState = {
  header: "",
  loadingPage: false,
  sapoTheme: createTheme({}),
};

const applicationSlice = createSlice({
  name: "application",
  initialState: initialState,
  reducers: {
    updateHeader: (state, action: PayloadAction<HeaderLink | undefined | string | null>) => {
      state.header = action.payload;
    },
    updateLoadingPage: (state, action) => {
      state.loadingPage = action.payload;
    },
  },
});

const { actions, reducer } = applicationSlice;

export const { updateHeader, updateLoadingPage } = actions;
export default reducer;
