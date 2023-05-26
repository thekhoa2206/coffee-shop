import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import i18n from "i18n";
import { isNil } from "lodash";
import AccountService from "services/AccountService";
import { UserResponse } from "services/types";
import { getCookie, removeCookieByPrefix } from "utilities";
import { CookieName } from "utilities/CookieNames";
import { AuthState } from "./types";

const initialState: AuthState = {
    isAuthenticated: false,
    loadingAuth: true,
    sessionHasBeenFetched: false,
    user: {} as UserResponse,
  };
  export const login = createAsyncThunk("authenticate/login", async (params, thunkApi) => {
    try {
      if (getCookie("jwt") !== "") {
        let res = await AccountService.getProfiles();
        let user: UserResponse = res.data;
        if (user) {
          if (user.roles && user.roles.length) {
            const allPermissions = user.roles.map((role) => role.code).flat();
            user.authorities = Array.from(new Set(allPermissions));
          }
          return user;
        } 
      }
    } catch (error) {
      return thunkApi.rejectWithValue("login error");
    }
  });

  const authenticateSlice = createSlice({
    name: "authenticate",
    initialState: initialState,
    reducers: {
      updateStatusLoadingAuth: (state, action: PayloadAction<boolean>) => {
        state.loadingAuth = action.payload;
      },
    },
    extraReducers: {
      [`${login.rejected}`]: (state, actions: PayloadAction<any>) => {
        state.sessionHasBeenFetched = true;
        window.location.href = `/login`;
      },
      [`${login.fulfilled}`]: (state, actions: PayloadAction<UserResponse>) => {
        state.user = actions.payload;
        state.isAuthenticated = true;
        state.sessionHasBeenFetched = true;
      },
    },
  });
  
  const { actions, reducer } = authenticateSlice;
  export const { updateStatusLoadingAuth } = actions;
  export default reducer;