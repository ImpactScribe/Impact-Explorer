import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface isConnectedState {
  value: boolean;
}
const initialState: isConnectedState = {
  value: false,
};

export const isConnectedSlice = createSlice({
  name: "isConnected",
  initialState: initialState,
  reducers: {
    setisConnected: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setisConnected } = isConnectedSlice.actions;
export default isConnectedSlice.reducer;
