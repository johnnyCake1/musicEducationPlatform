import { useEffect, useState } from "react";
import useLocalStorageState from "../../../util/useLocalStorageState";
import ProfilePicture from "../../Profile/components/profile_card/ProfilePicture";
import "./Conversations.css";
import { httpReqAsync } from "../../../services/httpReqAsync";

const Conversation = ({
  participantsIds,
  currentUserId,
  messages,
  isSelected,
  onClick
}) => {
  const [conversationName, setConversationName] = useState("");
  const [jwt] = useLocalStorageState("", "jwt");
  const idOfUserToDisplay = participantsIds.find(
    (userId) => userId !== currentUserId
  );
  useEffect(() => {
    httpReqAsync(
      `/api/v1/users/${idOfUserToDisplay}/username`,
      "GET",
      jwt
    ).then((username) => {
      setConversationName(username);
    });
  });
  return (
    <div
      className={`conversation-item ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <ProfilePicture userId={idOfUserToDisplay} />
      <div className="">
        <div className="username">{conversationName}</div>
        <div className="message-preview">
          {messages && messages.length > 0
            ? messages[messages.length - 1].message
            : ""}
        </div>
      </div>
    </div>
  );
};

const Conversations = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
}) => {
  const [currentUser] = useLocalStorageState(null, "currentUser");
  return (
    <div className="conversation-list">
      {conversations.map((conv) => (
        <Conversation
          key={conv.id}
          participantsIds={conv.participantsIds}
          currentUserId={currentUser.id}
          messages={conv.messages}
          isSelected={selectedConversation?.id === conv.id}
          onClick={() => setSelectedConversation(conv)}
        />
      ))}
    </div>
  );
};

export default Conversations;
