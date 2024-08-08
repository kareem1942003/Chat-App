import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  toggleChatUI,
  toggleDetailUI,
  toggleListUI,
} from "../../RTK/ResponseveUi";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const dispatch = useDispatch();

  const handleCloseAndOpenList = () => {
    dispatch(toggleListUI());
  };
  const handleCloseAndOpenChat = () => {
    dispatch(toggleChatUI());
  };
  const handleCloseAndOpenDetail = () => {
    dispatch(toggleDetailUI());
  };

  const handlImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
      // @ts-ignore
      setChat(res.data());
    });
    return () => {
      unsub();
    };
  }, [chatId]);

  const handelEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };

  const handleSend = async () => {
    if (text == "") return;

    let imgUrl = null;

    try {
      setIsLoading(true);
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updetedAt = Date.now();
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: "",
    });
    setText("");
    setIsLoading(false);
  };

  return (
    <div className="chat">
      <div className="top">
        <div
          className="icons"
          onClick={() => {
            handleCloseAndOpenList();
            handleCloseAndOpenChat();
          }}
        >
          <img src="./arrowLeft.png" alt="" />
        </div>
        <div
          className="user"
          onClick={() => {
            handleCloseAndOpenDetail();
            handleCloseAndOpenChat();
          }}
        >
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem, ipsum dolor sit amet consectetu.</p>
          </div>
        </div>
        <div className="icons">{/* <img src="./info.png" alt="" /> */}</div>
      </div>
      <div className="center">
        {
          // @ts-ignore
          chat?.messages?.map((message) => (
            <div
              key={message?.createdAt}
              className={
                message.senderId === currentUser?.id ? "message own" : "message"
              }
            >
              {message.senderId === currentUser?.id ? null : (
                <img src={user.avatar} alt="" />
              )}
              <div className="texts">
                {message.img && <img src={message.img} alt="" />}
                <p>{message.text}</p>
                {/* <span>{message.createdAt.toString()}</span> */}
              </div>
            </div>
          ))
        }
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handlImg}
          />
        </div>
        <textarea
          value={text}
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You can not send a message"
              : "Type a message..."
          }
          maxLength={50}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="button">
          <div className="emoji">
            <img
              src="./emoji.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />
            <div className="picker">
              <EmojiPicker open={open} onEmojiClick={handelEmoji} />
            </div>
          </div>
          {isLoading ? (
            <Button disabled={isLoading}>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            >
              Send
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
