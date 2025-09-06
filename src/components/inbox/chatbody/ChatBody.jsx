// import Blank from "./Blank";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../../../redux/features/messages/messagesApi";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import toast from "react-hot-toast";

export default function ChatBody() {
    const {id} = useParams()
    const {data: messages = [] , isError , isLoading, error} = useGetMessagesQuery(id)
    // console.log("checking from chatBody",messages)
    let content = null;
  if (isLoading) {
    content = <div className="m-2 text-center">Loading...</div>;
  } else if (!isLoading && isError) {
    content = toast.error(error);
  } else if (!isLoading && !isError && messages.length === 0) {
    content = <><p className="text-2xl text-center m-5 text-red-600 font-semibold">No messages found</p></>
  } else {
    content =  <>
     <ChatHead
          message={messages[0]}
        />
        <Messages messages={messages}/>
        <Options />
    </>}
  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">
        {content}
        {/* <Blank /> */}
      </div>
    </div>
  );
}
