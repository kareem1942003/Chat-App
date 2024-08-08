import Login from "./Components/login/Login";
import Chat from "./Components/chat/Chat";
import Detail from "./Components/detail/Detail";
import List from "./Components/list/List";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./Components/notification/Notification";
import { auth } from "./lib/firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

const App = () => {
  // @ts-ignore
  const listUi = useSelector((state) => state.responsiveUi.listIsOpen);
  // @ts-ignore
  const chatUi = useSelector((state) => state.responsiveUi.chatIsOpen);
  // @ts-ignore
  const detailUi = useSelector((state) => state.responsiveUi.detailIsOpen);
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div className="isLoading">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container">
      {currentUser ? (
        <>
          {listUi ? <List /> : null}
          {chatUi ? chatId && <Chat /> : null}
          {detailUi ? chatId && <Detail /> : null}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
