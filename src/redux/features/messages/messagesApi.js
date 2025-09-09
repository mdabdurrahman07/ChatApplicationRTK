import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query({
      query: (id) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
    }),
    addMessages: build.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessagesMutation } = messagesApi;
