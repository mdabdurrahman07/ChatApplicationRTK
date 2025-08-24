import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../../redux/features/conversation/conversationApi";
import ChatItem from "./ChatItem";
import toast from "react-hot-toast";
import moment from "moment";
import getPartnerInfo from "../../utils/getPartnerInfo";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  //   what to render
  const {
    data: conversations,
    isError,
    error,
    isLoading,
  } = useGetConversationsQuery(email);
  let content = null;
  if (isLoading) {
    content = <li className="m-2 text-center">Loading...</li>;
  } else if (!isLoading && isError) {
    content = toast.error(error);
  } else if (!isLoading && !isError && conversations.length === 0) {
    content = toast.error("No conversation found");
  } else {
    content = conversations.map((conversation) => {
      const { id, message, timestamp } = conversation;
      const {name} = getPartnerInfo(conversation.users , email)
      return (
        <li key={id}>
          <ChatItem
            avatar="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
            name={name}
            lastMessage={message}
            lastTime={moment(timestamp).fromNow()}
          />
        </li>
      );
    });
  }
  return <ul>{content}</ul>;
}
