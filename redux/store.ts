import { configureStore } from "@reduxjs/toolkit";
import NftReducer from "@/redux/slices/nfts.slice";
import GeojsonReducer from "@/redux/slices/geojson.slice";
import isConnectedReducer from "@/redux/slices/isconnected.slice";
import AccountReducer from "@/redux/slices/account.slice";

export const store = configureStore({
  reducer: {
    nfts: NftReducer,
    geojson: GeojsonReducer,
    isConnected: isConnectedReducer,
    userAccount: AccountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
