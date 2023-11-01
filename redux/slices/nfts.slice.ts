import { NFTData } from "@/redux/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface NftState {
  value: NFTData[];
}
const initialState: NftState = {
  value: [],
};

export const NftSlice = createSlice({
  name: "nfts",
  initialState: initialState,
  reducers: {
    getData: (state, action: PayloadAction<NFTData[]>) => {
      state.value = action.payload;
    },
  },
});

export const { getData } = NftSlice.actions;
export default NftSlice.reducer;
