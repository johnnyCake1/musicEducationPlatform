import React, { useEffect, useState } from "react";
import Conversations from "./components/Conversations";
import { httpReqAsync } from "../../services/httpReqAsync";
import useLocalStorageState from "../../util/useLocalStorageState";
import ProfilePicture from "../Profile/components/profile_card/ProfilePicture";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "./ChatPage.css";

const ChatPage = () => {
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [jwt] = useLocalStorageState("", "jwt");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const [privateChats, setPrivateChats] = useState([]);
  const [selectedPrivateChat, setSelectedPrivateChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);

  const [stompClient, setStompClient] = useState(null);

  const isConnected = stompClient && stompClient.connected;

  useEffect(() => {
    httpReqAsync(
      `/api/v1/chats/private-chats/${currentUser.id}`,
      "GET",
      jwt
    ).then((result) => {
      console.log("Got all the private chats:", result);
      setPrivateChats(result);
    });
  }, [jwt, currentUser]);

  useEffect(() => {
    const socket = new SockJS("/chat");
    const client = Stomp.over(socket);
    client.connect({}, () => {
      setStompClient(client);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [stompClient]);

  useEffect(() => {
    if (selectedPrivateChat) {
      //load selectedChatMessages
      console.log("this is selected:", selectedPrivateChat);

      // Subscribe to the selected conversation's topic
      const subscription = stompClient.subscribe(
        `/topic/private/${selectedPrivateChat.id}`,
        (message) => {
          const chatMessage = JSON.parse(message.body);
          console.log("Socket sent result:", chatMessage);
          setSelectedChatMessages((prevMessages) => [...prevMessages, chatMessage]);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedPrivateChat, stompClient]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleMessageSend = (event) => {
    event.preventDefault();

    if (isConnected) {
      if (messageInput) {
        const chatMessage = {
          senderId: currentUser.id, // Update with appropriate sender information
          content: messageInput,
        };

        stompClient.send(
          `/app/private/${selectedPrivateChat.id}/sendPrivateMessage`,
          {},
          JSON.stringify(chatMessage)
        );
      }

      if (uploadedFile) {
        //then send the file
      }
    }
  };

  const onDelete = (messageId) => {};

  if (!privateChats) return <div>Loading private chats...</div>;
  if (!isConnected) return <div>Connecting...</div>;

  return (
    <div className="chat-page">
      <div className="left-column">
        <div className="left-column-content">
          <div className="chat-profile-info">
            <ProfilePicture userId={currentUser.id} />
            <div className="username">{`@${currentUser.username}`}</div>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search users or messages"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {privateChats && (
            <Conversations
              privateChats={privateChats.filter((chat) => {
                console.log("fff:", chat);
                // Check if the conversation name matches the search term
                // const nameMatch = conversation.name
                //   .toLowerCase()
                //   .includes(searchTerm.toLowerCase());

                // // Check if any of the conversation's messages match the search term
                // const messageMatch = conversation.messages.some((message) =>
                //   message.message
                //     .toLowerCase()
                //     .includes(searchTerm.toLowerCase())
                // );

                // return nameMatch || messageMatch;
                return true;
              })}
              selectedPrivateChat={selectedPrivateChat}
              setSelectedPrivateChat={setSelectedPrivateChat}
              setSelectedChatMessages={setSelectedChatMessages}
            />
          )}
        </div>

        {/* <div className="logo-background">
            <Logo />
          </div> */}
      </div>
      {selectedPrivateChat && (
        <div className="right-column">
          <div className="chat-header">
            <ProfilePicture />
            <div className="username">chat id: {selectedPrivateChat.id}</div>
          </div>
          <div className="message-history">
            {selectedChatMessages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${
                  message.senderId === currentUser.id ? "align-right color" : ""
                }`}
              >
                {console.log("logging!!!", message)}
                <div className="message-bubble">
                  {message.content}
                  {message.senderId === currentUser.id && (
                    <i
                      className="fas fa-trash delete-icon"
                      onClick={() => onDelete(message.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleMessageSend}>
            <div className="message-input">
              <input
                style={{ width: "100%" }}
                type="text"
                placeholder="Type your message here"
                value={messageInput}
                onChange={(event) => setMessage(event.target.value)}
              />
              <label htmlFor="file-upload" className="upload-button">
                <i className="fas fa-paperclip chat-upload-icon"></i>
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                style={{
                  display: "none",
                }}
              />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
