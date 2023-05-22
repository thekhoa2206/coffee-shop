import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaletteColors, ThemeState } from "./types";
import { colorBlue } from "theme/palette";

const initialState: ThemeState = {
  currentTheme: colorBlue,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<PaletteColors>) => {
      state.currentTheme = action.payload;
    },
  },
});

const { actions, reducer } = themeSlice;
export const { updateTheme } = actions;

export default reducer;
