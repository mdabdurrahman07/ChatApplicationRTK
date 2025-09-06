import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../../redux/features/conversation/conversationApi";
import ChatItem from "./ChatItem";
import toast from "react-hot-toast";
import moment from "moment";
import getPartnerInfo from "../../utils/getPartnerInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};

  const {
    data: conversations = [],
    isError,
    error,
    isLoading,
  } = useGetConversationsQuery(email, { skip: !email });

  useEffect(() => {
    if (isError) {
      toast.error(error?.data || "Failed to load conversations");
    }
    if (!isError && !isLoading && conversations.length === 0) {
      toast.error("No conversations found");
    }
  }, [isError, error, isLoading, conversations.length]);

  if (isLoading) {
    return <li className="m-2 text-center">Loading...</li>;
  }

  if (!isLoading && conversations.length === 0) {
    return <li className="m-2 text-center">No conversations yet</li>;
  }

  return (
    <ul>
      {conversations.map((conversation) => {
        const { id, message, timestamp } = conversation;
        const { name, email: partnerEmail } = getPartnerInfo(
          conversation.users,
          email
        );
        return (
          <li key={id}>
            <Link to={`/inbox/${id}`}>
              <ChatItem
                avatar={gravatarUrl(partnerEmail, { size: 80 })}
                name={name}
                lastMessage={message}
                lastTime={moment(timestamp).fromNow()}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

