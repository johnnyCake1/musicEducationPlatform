import React, { useEffect, useRef } from "react";
import "./style.css"

const Message = ({ message }) => {

  const currentUser = {
    uid: "1",
    photoURL: "photo_url"
  }; 

  const ref = useRef();
  const data = {
    user: {
      photoURL: "photo_url"
    }
  }

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
