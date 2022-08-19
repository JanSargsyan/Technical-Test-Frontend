import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DataState {
  value: number; // added for tests
  loading: boolean;
  results: Array<any>;
}

const initialState: DataState = {
  value: 0, // added for tests
  loading: false,
  results: [],
};

export const fetchElements = createAsyncThunk(
  "fetchElements",
  async (params: any) => {
    const { url } = params;
    const response = await fetch(url).then((data) => data.json());
    return response.data;
  }
);

export const dataSlice: any = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchElements.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchElements.fulfilled, (state, action) => {
      state.loading = false;
      state.results = action.payload;
    });
    builder.addCase(fetchElements.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default dataSlice.reducer;
