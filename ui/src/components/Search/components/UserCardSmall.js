import { useNavigate } from "react-router-dom";
import ProfilePicture from "../../Profile/components/profile_card/ProfilePicture";
import "./UserCardSmall.css";

const UserCardSmall = ({ userId, img_url, username, description }) => {
  const navigate = useNavigate();
  return (
    <div
      className="user-small-card card p-2"
      onClick={() => navigate(`/${userId}/profile`)}
    >
      <ProfilePicture imageSrc={img_url} size={75} />
      <div className="user-small-details">
        <h3 className="user-small-username">@{username}</h3>
        <p className="user-small-description ">{description}</p>
      </div>
    </div>
  );
};

export default UserCardSmall;
