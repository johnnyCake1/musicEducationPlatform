import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import Conversations from "./components/Conversations";
import { httpReqAsync, postFile } from "../../services/httpReqAsync";
import useLocalStorageState from "../../util/useLocalStorageState";
import ProfilePicture from "../Profile/components/profile_card/ProfilePicture";
import { API_URL } from '../../constants';

const ChatPage = () => {
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [jwt] = useLocalStorageState("", "jwt");
  const [conversations, setConversations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [toggleRefresh, setToggleRefresh] = useState(true);

  const [fileBlobs, setFileBlobs] = useState({});

  useEffect(() => {
    httpReqAsync(
      `/api/v1/conversations?userId=${currentUser.id}`,
      "GET",
      jwt
    ).then((convs) => {
      setIsLoading(false);
      setConversations(convs);
    });
  }, [jwt, toggleRefresh, currentUser.id]);

  useEffect(() => {
    if (selectedConversation) {
      const promises = [];
      const blobs = {};

      for (const m of selectedConversation.messages) {
        if (!m.message) {
          const promise = fetch(API_URL +`/storage/messageFile?messageId=${m.id}`)
            .then((resp) => resp.blob())
            .then((blob) => {
              blobs[m.id] = blob;
            });

          promises.push(promise);
        }
      }
      Promise.all(promises)
        .then(() => {
          setFileBlobs((prevFileBlobs) => ({ ...prevFileBlobs, ...blobs }));
        })
        .catch((error) => {
          console.error("Error occurred during fetch requests:", error);
        });
    }
  }, [selectedConversation, toggleRefresh]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleMessageSend = (event) => {
    event.preventDefault();
    if (message) {
      const newMessage = {
        conversationId: selectedConversation.id,
        sender: { id: currentUser.id },
        message: message,
      };
      httpReqAsync(`/api/v1/messages`, "POST", jwt, newMessage).then(
        (message) => {
          setToggleRefresh(!toggleRefresh);
          setMessage("");
        }
      );
    }

    if (uploadedFile) {
      postFile(
        `storage/messageFile?conversationId=${selectedConversation.id}&userId=${currentUser.id}`,
        uploadedFile,
        jwt
      ).then((resp) => {
        console.log("Resp:", resp);
        setToggleRefresh(!toggleRefresh);
        setUploadedFile(null);
      });
    }
  };

  const onDelete = (messageId) => {
    httpReqAsync(`api/v1/messages?messageId=${messageId}`, "DELETE", jwt).then(
      (resp) => {
        console.log("deleted!");
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;

  const renderFile = (messageId) => {
    const file = fileBlobs[messageId];
    if (!file) {
      return <div>Loading...</div>;
    }
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const fileSrc = URL.createObjectURL(file);
    // Limit the preview size to 300px x 300px
    const previewStyle = {
      maxWidth: "300px",
      maxHeight: "300px",
    };
    return (
      <div className="file-display">
        {isImage ? (
          <img src={fileSrc} alt={file.name} style={previewStyle} />
        ) : isVideo ? (
          <video controls style={previewStyle}>
            <source src={fileSrc} type={file.type} />
          </video>
        ) : (
          <div className="file-icon">
            <i className="fas fa-file" />
          </div>
        )}

        <div className="file-info">
          <div className="file-name">{file.name}</div>
          <div className="file-actions">
            <a href={fileSrc} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-download" />
              Download
            </a>
          </div>
        </div>
      </div>
    );
  };

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
          {conversations && (
            <Conversations
              conversations={conversations.filter((conversation) => {
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
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
            />
          )}
        </div>

        {/* <div className="logo-background">
            <Logo />
          </div> */}
      </div>
      {selectedConversation && (
        <div className="right-column">
          <div className="chat-header">
            <ProfilePicture />
            <div className="username">{selectedConversation.name}</div>
          </div>
          <div className="message-history">
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${
                  message.sender.id === currentUser.id
                    ? "align-right color"
                    : ""
                }`}
              >
                {message.message ? (
                  <div className="message-bubble">
                    {message.message}
                    {message.sender.id === currentUser.id && (
                      <i
                        className="fas fa-trash delete-icon"
                        onClick={() => onDelete(message.id)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="message-bubble">
                    {renderFile(message.id)}
                    {message.sender.id === currentUser.id && (
                      <i
                        className="fas fa-trash delete-icon"
                        onClick={() => onDelete(message.id)}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleMessageSend}>
            <div className="message-input">
              <input
                style={{ width: "100%" }}
                type="text"
                placeholder="Type your message here"
                value={message}
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
