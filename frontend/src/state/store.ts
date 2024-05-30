import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { communityMessagesState } from "./slices";
import { GreenSpaceDAOApi } from "./services";

const store = configureStore({
  reducer: {
    communityMessagesState: communityMessagesState.reducer,
    [GreenSpaceDAOApi.reducerPath]: GreenSpaceDAOApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(GreenSpaceDAOApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
