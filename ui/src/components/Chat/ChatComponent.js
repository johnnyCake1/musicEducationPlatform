// ChatComponent.js
import React, { useState, useEffect, useRef } from 'react';
import { webSocketService } from '../../services/webSocketService';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';
import { useLocation, useParams } from 'react-router-dom';
import ChatRoomList from './components/ChatRoomList';
import './ChatComponent.css';
import Loader from '../common/Loader';

const ChatComponent = () => {
  const location = useLocation();
  // Get the query string from the location
  // Parse the query string into an object
  const queryParams = new URLSearchParams(location.search);
  // Access the initial active chat through query parameters
  const otherUserIdQueryParam = queryParams.get('otherUserId');

  const [otherUserId, setOtherUserId] = useState(otherUserIdQueryParam);

  const [currentUser] = useLocalStorageState(null, 'currentUser');
  const [jwt] = useLocalStorageState('', 'jwt');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imgUrl, setImgUrl] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    //connect to the web sockets and subscribe
    webSocketService.connect(
      currentUser.id,
      otherUserId,
      (messages) => {
        setMessages(messages);
      },
      (rooms) => {
        setChatRooms(rooms);
      }
    );
    if (otherUserId && jwt) {
      httpReqAsync(
        `/api/v1/messages/${currentUser.id}/${otherUserId}`,
        'GET',
        jwt
      )
        .then((result) => {
          console.log('I got the messages:', result);
          setMessages(result);
        })
        .catch((err) => {
          console.log("Couldn't fetch messages for this chatroom");
        });
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [currentUser.id, jwt, otherUserId]);

  const sendMessage = () => {
    const timestamp = new Date(); // Current time
    const messageToSend = {
      content: newMessage,
      senderId: currentUser.id,
      recipientId: otherUserId,
      file_url: imgUrl,
      timestamp: timestamp.toISOString(), // ISO 8601 format
    };
    webSocketService.sendMessage(`/app/chat`, messageToSend);
    setMessages((prevMessages) => [...prevMessages, messageToSend]); // Optimistically update the UI without ensuring that it reached the backend and got saved successfully

    setImgUrl(null);
    setNewMessage('');
  };
  const fileInputRef = useRef(null);

  const handleFileChange = (e, moduleIndex, topicIndex) => {
    const { type, files } = e.target;
    if (type === 'file') {
      httpReqAsync('/api/v1/files', 'POST', jwt, files[0]).then((result) => {
        console.log('state of result content data after sending file:', result);
        if (result.file_url) {
          setImgUrl(result.file_url);
        }
      });
      return;
    }
  };
  return (
    <div className="chat-component">
      <div className="chat-room-list">
        {chatRooms.length === 0 && <Loader />}
        <ChatRoomList
          chatRooms={chatRooms}
          handleSetActiveChatUserId={setOtherUserId}
        />
      </div>
      {otherUserId ? (
        <div className="active-chat flex flex-col h-full">
          <ul className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && <Loader />}
            {messages
              .filter((msg) => msg.recipientId === otherUserId)
              .map((msg, index) => (
                <li
                  key={index}
                  style={{ maxWidth: 'max-content' }}
                  className={`p-2 rounded-lg ${
                    msg.senderId === currentUser.id
                      ? 'bg-blue-200 ml-auto'
                      : 'bg-gray-200'
                  }`}
                >
                  <p className="text-sm" style={{ maxWidth: 300 }}>
                    {msg.content}
                  </p>
                  {msg.file_url && (
                    <a
                      href={msg.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 underline"
                    >
                      View file
                    </a>
                  )}
                  <span className="text-xs text-gray-500 block mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
          </ul>
          {imgUrl && (
            <div className="w-full relative bg-gray-500">
              <img
                src={imgUrl}
                alt="preview"
                className="w-1/2 h-20 object-cover object-center rounded-md"
              />
              {/* delete image button with x */}
              <button
                className="mt-5 mr-2 absolute top-0 right-0 p-2 rounded-md hover:bg-gray-200 flex items-center space-x-1 bg-red-500 text-white"
                onClick={() => setImgUrl(null)}
              >
                Delete file
                {/* delete icon */}
                <ion-icon name="trash" />
              </button>
            </div>
          )}
          <div className="flex items-center p-3 border-t border-gray-300">
            {/* img or doc preview */}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              className="mr-2 p-2 rounded-md hover:bg-gray-200"
              onClick={() => fileInputRef.current.click()} // Implement this function to handle attachment logic
            >
              {/* Example SVG for attachment icon */}
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.364 6.364a2 2 0 11-2.828-2.828l6.364-6.364a2 2 0 112.828 2.828l-6.364 6.364a4 4 0 01-5.656-5.656l6.364-6.364a4 4 0 015.656 5.656L9.172 17"
                />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              className="flex-1 p-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="active-chat flex justify-center items-center h-full">
          Choose chat to start messaging
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
