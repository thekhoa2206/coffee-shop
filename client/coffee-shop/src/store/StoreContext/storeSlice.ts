import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import StoreService, { CityResponse, DistrictResponse, StoreResponse } from "services/StoreService";
import { StoreContext } from "./types";

const initialState: StoreContext = {};


export const fetchStoreContext = createAsyncThunk("storeContext/fetchStoreContext", async (params, thunkAPI) => {
    try {
        let [
            storeResponse,
        ] = await Promise.all([
            StoreService.getStore(),
        ]);
        let response = {} as StoreContext;
        response.store = storeResponse?.data.store || null;
        response.cities = null;
        response.districts = null;
        return response;
    } catch (error) {
        return Promise.reject();
    }
});

const storeContextSlice = createSlice({
    name: "storeContext",
    initialState: initialState,
    reducers: {
        updateCurrentStore: (state, action: PayloadAction<StoreResponse>) => {
            state.store = action.payload;
        },
        updateCities: (state, action: PayloadAction<CityResponse[]>) => {
            state.cities = action.payload;
        },
        updateDistricts: (state, action: PayloadAction<DistrictResponse[]>) => {
            state.districts = action.payload;
        },
    },
    extraReducers: {
        [`${fetchStoreContext.fulfilled}`]: (state, action: PayloadAction<StoreContext>) => {
            const {
                store,
                cities,
                districts,
            } = action.payload;
            state.store = store;
            state.cities = cities;
            state.districts = districts;
        },
    },
});

const { actions, reducer } = storeContextSlice;

export const {
    updateCurrentStore,
    updateCities,
    updateDistricts,
  } = actions;

  export default reducer;
