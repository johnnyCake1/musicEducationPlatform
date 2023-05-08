import Cam from "./img/cam.png";
import Add from "./img/add.png";
import More from "./img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import "./style.css"

const Chat = () => {
  const data = {
    user: {
      displayName : "display_name"
    }
  }
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  );
};

export default Chat;
