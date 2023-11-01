import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface accountState {
  value: string;
}
const initialState: accountState = {
  value: "",
};

export const acountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setAccount } = acountSlice.actions;
export default acountSlice.reducer;
