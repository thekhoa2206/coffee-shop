import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie } from "utilities";
import { MenuState } from "./types";
import { MenuItem } from "../../components/Menu/MenuData/MenuData.types";

let menuSizeClass = getCookie("menu-size-class");
let menuCollapse = Boolean(menuSizeClass && menuSizeClass === "sapo-menu-collapse");

const initialState: MenuState = {
  isLoadingMenu: true,
  collapse: menuCollapse,
  isAddChannel: false,
  isHidden: false,
  menuItems: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState: initialState,
  reducers: {
    updateStatusLoadingMenu: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMenu = action.payload;
    },
    updateCollapseMenuStatus: (state, action: PayloadAction<boolean>) => {
      var cookieExpires = new Date();
      cookieExpires.setFullYear(cookieExpires.getFullYear() + 10);
      document.cookie = `menu-size-class=${
        action.payload ? "menu-collapse" : "menu-expand"
      }; expires=${cookieExpires.toUTCString()}; path=/`;
      state.collapse = action.payload;
    },
    updateStatusAddChannel: (state, action: PayloadAction<boolean>) => {
      state.isAddChannel = action.payload;
    },
    updateIsHiddenMenu: (state, action: PayloadAction<boolean>) => {
      state.isHidden = action.payload;
    },
    updateMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = action.payload;
    },
  },
});

const { actions, reducer } = menuSlice;

export const {
  updateStatusLoadingMenu,
  updateCollapseMenuStatus,
  updateStatusAddChannel,
  updateIsHiddenMenu,
  updateMenuItems,
} = actions;
export default reducer;
