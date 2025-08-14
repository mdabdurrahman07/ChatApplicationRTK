import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSliceReducer from "./features/auth/authSlice";
import conversationSliceReducer from "./features/conversation/conversationSlice";
import messagesSliceReducer from "./features/messages/messagesSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    messages: messagesSliceReducer,
    conversation: conversationSliceReducer,
  },
  devTools: import.meta.env.MODE !== "production",
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(apiSlice.middleware),
});
