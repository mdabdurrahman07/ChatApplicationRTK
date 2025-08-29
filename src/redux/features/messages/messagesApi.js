import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query({
      query: (id) =>
        `/messages?conversationId_like=${id}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
    }),
  }),
});

export const { useGetMessagesQuery } = messagesApi;
