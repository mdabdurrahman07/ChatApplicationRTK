import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getConversations: build.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
    }),
    getConversation: build.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversations?participants_like=${userEmail}-${participantEmail}||participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: build.mutation({
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;
        if (conversationApi?.id) {
          // silent entry to message table
          const users = arg?.data?.users;
          const senderUser = users.find((user) => user.email === arg?.sender);
          const receiverUser = users.find((user) => user.email !== arg?.sender);
          dispatch(
            messagesApi.endpoints.addMessages.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUser,
              receiver: receiverUser,
              message: arg?.data?.message,
              timestamp: arg?.data?.timestamp,
            })
          );
        }
      },
    }),
    editConversation: build.mutation({
      query: ({ sender, data, id }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;
        if (conversationApi?.id) {
          // silent entry to message table
          const users = arg?.data?.users;
          const senderUser = users.find((user) => user.email === arg?.sender);
          const receiverUser = users.find((user) => user.email !== arg?.sender);
          dispatch(
            messagesApi.endpoints.addMessages.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUser,
              receiver: receiverUser,
              message: arg?.data?.message,
              timestamp: arg?.data?.timestamp,
            })
          );
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
