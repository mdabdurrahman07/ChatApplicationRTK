import { apiSlice } from "../api/apiSlice";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getConversations: build.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
    }),
    getConversation: build.query({
      query: ({userEmail, participantEmail}) =>
        `/conversations?participants_like=${userEmail}-${participantEmail}||participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: build.mutation({
      query: (data) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
    }),
    editConversation: build.mutation({
      query: ({ data, id }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
