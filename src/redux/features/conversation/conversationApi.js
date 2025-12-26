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
        `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: build.mutation({
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg?.data?.users;
            const senderUser = users.find((user) => user.email === arg?.sender);
            const receiverUser = users.find(
              (user) => user.email !== arg?.sender
            );
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
        } catch (error) {
          console.log("add conversationApi", error);
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
        // optimistic cache update start
        const patchResult1 = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              const draftConversation = draft.find((c) => c.id == arg.id);
              draftConversation.message = arg.data.message;
              draftConversation.timestamp = arg.data.timestamp;
            }
          )
        );
        // optimistic cache update end
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg?.data?.users;
            const senderUser = users.find((user) => user.email === arg?.sender);
            const receiverUser = users.find(
              (user) => user.email !== arg?.sender
            );
            const res = await dispatch(
              messagesApi.endpoints.addMessages.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg?.data?.message,
                timestamp: arg?.data?.timestamp,
              })
            ).unwrap();
            // update messages cache pessimistically start

            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res?.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );

            // update messages cache pessimistically end
          }
        } catch (error) {
          patchResult1.undo;
          console.log("edit conversationApi", error);
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
