import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_API_URL,
    prepareHeaders: async (Headers, { getState, endpoint }) => {
      console.log("checking what is getState in baseApi", getState);
      console.log("checking what is endpoints in baseApi", endpoint);
      const token = getState()?.auth.accessToken;
      if (token) {
        Headers.set("Authorization", `Bearer ${token}`);
      }
      return Headers;
    },
  }),
  tagTypes: [],
  endpoints: (build) => ({}),
});
