import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GeoJSONState {
  value: any;
}
const initialState: GeoJSONState = {
  value: null,
};

export const geojsonSlice = createSlice({
  name: "geojson",
  initialState: initialState,
  reducers: {
    setGeoJson: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export const { setGeoJson } = geojsonSlice.actions;
export default geojsonSlice.reducer;
