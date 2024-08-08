import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import LogoutIcon from "@mui/icons-material/Logout";
import "./userInfo.css";
import { auth } from "../../../lib/firebase";

const UserInfo = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h6>{currentUser.username}</h6>
      </div>
      <div className="icons">
        <div onClick={() => auth.signOut()}>
          <LogoutIcon sx={{ cursor: "pointer" }} />
        </div>
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div>
  );
};

export default UserInfo;
