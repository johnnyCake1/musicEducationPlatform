// ChatRoomList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { httpReqAsync } from '../../../services/httpReqAsync';
import useLocalStorageState from '../../../util/useLocalStorageState';

const ChatRoomList = ({ handleSetActiveChatUserId }) => {
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [jwt] = useLocalStorageState("", "jwt");
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    // Fetch the list of chat rooms for the current user
    httpReqAsync(`/api/v1/messages/${currentUser.id}`, 'GET', jwt)
      .then((result) => {
        setChatRooms(result || []);
        console.log("Chatroom list of current user:", result);
      }).catch((err) => {
        console.log("No chats for the current user")
      });
  }, [currentUser.id, jwt]);

  return (
    <ul>
      {chatRooms.map((room) => (
        <li key={room.id}>
          <Link onClick={() => { handleSetActiveChatUserId(room.recipientId) }}>
            {room.chatRoomName}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ChatRoomList;
