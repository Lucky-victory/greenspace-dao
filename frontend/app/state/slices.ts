import { communityMessages } from "@/db/schema";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GreenSpaceDAOApi } from "./services";

//TODO: Add  types
export const communityMessagesState = createSlice({
  name: "communityMessages",
  initialState: {
    data: [] as any[],
  },
  reducers: {
    update: (state, action: PayloadAction<{ data: Record<string, any>[] }>) => {
      state.data = action.payload.data;
    },
    addMessage: (state, action: PayloadAction<{}>) => {
      state.data.push(action.payload);
    },
  },
  extraReducers(builder) {
     builder.addMatcher(GreenSpaceDAOApi.endpoints.getCommunityMessages.matchFulfilled, (state, action) => {
    
      state.data = action.payload.data!;
    })
  },
});

export const { update, addMessage } = communityMessagesState.actions;
