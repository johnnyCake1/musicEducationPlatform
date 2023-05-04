import React, { useState } from "react";
import Message from "./Message";
import "./style.css"

const Messages = () => {
  const message = {
    senderId : "1",
    text: "text_message",
    img: "message_image"
  }
  const [messages, setMessages] = useState([message]);

  console.log(messages)

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
