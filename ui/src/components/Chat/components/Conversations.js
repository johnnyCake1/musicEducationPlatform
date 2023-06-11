import { useEffect, useState } from "react";
import useLocalStorageState from "../../../util/useLocalStorageState";
import ProfilePicture from "../../Profile/components/profile_card/ProfilePicture";
import "./Conversations.css";
import { httpReqAsync } from "../../../services/httpReqAsync";

const Conversation = ({
  participantsIds,
  currentUserId,
  chatMessages,
  isSelected,
  onClick,
}) => {
  const [conversationName, setConversationName] = useState("");
  const [conversationImgUrl, setConversationImgUrl] = useState("");
  const [jwt] = useLocalStorageState("", "jwt");
  const idOfUserToDisplay = participantsIds.find(
    (userId) => userId !== currentUserId
  );
  useEffect(() => {
    httpReqAsync(`/api/v1/users/${idOfUserToDisplay}`, "GET", jwt).then(
      (user) => {
        setConversationImgUrl(user.img_url);
        setConversationName(user.username);
      }
    );
  });
  return (
    <div
      className={`conversation-item ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <ProfilePicture imageSrc={conversationImgUrl} />
      <div className="">
        <div className="username">{conversationName}</div>
        <div className="message-preview">
          {chatMessages && chatMessages.length > 0
            ? chatMessages[chatMessages.length - 1].content
            : ""}
        </div>
      </div>
    </div>
  );
};

const Conversations = ({
  privateChats,
  selectedPrivateChat,
  setSelectedPrivateChat,
  setSelectedChatMessages,
}) => {
  const [currentUser] = useLocalStorageState(null, "currentUser");
  return (
    <div className="conversation-list">
      {privateChats.map((chat) => (
        <Conversation
          key={chat.id}
          participantsIds={chat.participantsIds}
          currentUserId={currentUser.id}
          chatMessages={chat.chatMessages}
          isSelected={selectedPrivateChat?.id === chat.id}
          onClick={() => {
            setSelectedPrivateChat(chat);
            setSelectedChatMessages(chat.chatMessages);
          }}
        />
      ))}
    </div>
  );
};

export default Conversations;
