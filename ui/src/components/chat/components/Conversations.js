import ProfilePicture from "../../Profile/components/profile_card/ProfilePicture";
import "./Conversations.css";

const Conversations = ({ conversations, selectedUser, onClick }) => {
    return (
    <div className="conversation-list">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={`conversation-item ${
            selectedUser?.id === conv.id ? "selected" : ""
          }`}
          onClick={() => onClick(conv)}
        >
          <ProfilePicture />
          <div className="">
            <div className="username">{conv.name}</div>
            <div className="message-preview">
              {conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].message : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Conversations;
