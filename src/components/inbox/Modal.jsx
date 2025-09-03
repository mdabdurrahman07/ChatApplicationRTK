import { useEffect, useState } from "react";
import isValidEmail from "../../utils/isValidEmail";
import { useGetUsersQuery } from "../../redux/features/users/usersApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { conversationApi } from "../../redux/features/conversation/conversationApi";

export default function Modal({ open, control }) {
  const dispatch = useDispatch();
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [userCheck, setUserCheck] = useState(false);
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};
  const [conversation, setConversation] = useState(undefined);

  // getting the user
  const { data: participant } = useGetUsersQuery(to, {
    skip: !userCheck,
  });

  useEffect(() => {
    // check conversation existence
    if (participant?.length > 0 && participant[0].email !== myEmail) {
      dispatch(
        conversationApi.endpoints.getConversation.initiate({
          userEmail: myEmail,
          participantEmail: to,
        })
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        })
        .catch((err) => toast.error(err.message));
    }
  }, [dispatch, myEmail, participant, to]);
  // debounce handler
  const debounceHandler = (fn, delay) => {
    let timeOut;
    return (...arg) => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        fn(...arg);
      }, delay);
    };
  };
  // debounce Search
  const doSearch = (value) => {
    if (isValidEmail(value)) {
      setUserCheck(true);
    }
    setTo(value);
  };
  // from handler
  const handleSearch = debounceHandler(doSearch, 500);
  const handleNewConversation = (e) => {
    e.preventDefault()
    console.log("convo check");
  };
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleNewConversation}>
            <input type="hidden" name="remember" value="true" />
            {/* email & messages input */}
            <div className="rounded-md shadow-sm -space-y-px">
              {/* email input */}
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {/* messages input */}
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            {/* button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={
                  conversation === undefined ||
                  (participant?.length > 0 && participant[0].email === myEmail)
                }
              >
                Send Message
              </button>
            </div>

            {participant?.length === 0 &&
              toast.error("This user doesn't exits")}
            {participant?.length > 0 &&
              participant[0].email === myEmail &&
              toast.error("You can't send message to yourself")}
          </form>
        </div>
      </>
    )
  );
}
