import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../../redux/features/conversation/conversationApi";
import ChatItem from "./ChatItem";
import toast from "react-hot-toast";
import moment from "moment";
import getPartnerInfo from "../../utils/getPartnerInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";

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
      const { name, email: partnerEmail } = getPartnerInfo(
        conversation.users,
        email
      );
      return (
        <li key={id}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={gravatarUrl(partnerEmail, {
                size: 80,
              })}
              name={name}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }
  return <ul>{content}</ul>;
}
