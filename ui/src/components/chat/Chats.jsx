import React, { useEffect, useState } from "react";
import "./style.css"

const Chats = () => {

  const example_chats = [
    {
      id: 1,
      userInfo: {
        photoUrl: "photo_url",
        displayName: "display_name",
      },
      lastMessage: {
        text: "last_message_text"
      }
    }
  ];

  const [chats, setChats] = useState(example_chats);

  const currentUser = {
    uid: "1"
  };

  useEffect(() => {
    //fecth all chats
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    console.log("chat selected");
  };

  return (
    <div className="chats">
      {chats.map((chat) => (
        <div
          className="userChat"
          key={chat.id}
          onClick={() => handleSelect(chat.userInfo)}
        >
          <img src={chat.userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat.userInfo.displayName}</span>
            <p>{chat.lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
