import ProfilePicture from "./ProfilePicture";
import "./ProfileCard.css";
import useLocalStorageState from "../../../../util/useLocalStorageState";
import { useNavigate } from "react-router-dom";
import { httpReqAsync } from "../../../../services/httpReqAsync";
const ProfileCard = ({
  userId,
  img_url,
  firstName,
  lastName,
  username,
  tags,
  followersIds,
  followingsIds,
  numberOfTakenCourses,
  numberOfPublishedCourses,
  setParentComponentRefreshToggle,
  parentComponentRefreshToggle,
}) => {
  const [currentUser] = useLocalStorageState(null, "currentUser");
  const [jwt] = useLocalStorageState("", "jwt");
  const navigate = useNavigate();
  const handleMessage = () => {
    httpReqAsync(
      `/api/v1/conversations?participantsIds=${currentUser.id},${userId}`,
      "POST",
      jwt
    ).then((convId) => {
      console.log("conv created!:", convId);
      navigate(`/chat?selectedConversation=${convId}`);
    });
  };

  console.log("profile card loaded");

  const handleFollow = () => {
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/follow?userIdToFollow=${userId}`,
      "POST",
      jwt
    ).then(() => {
      setParentComponentRefreshToggle(!parentComponentRefreshToggle);
    });
  };

  const handleUnfollow = () => {
    httpReqAsync(
      `/api/v1/users/${currentUser.id}/unfollow?userIdToUnfollow=${userId}`,
      "POST",
      jwt
    ).then(() => {
      setParentComponentRefreshToggle(!parentComponentRefreshToggle);
    });
  };

  return (
    <div className="profile-header">
      <ProfilePicture imageSrc={img_url} size={200} borderColor="#fff" />
      <div className="profile-info">
        <div className="profile-name-wrapper">
          <h1 className="profile-name">
            {firstName} {lastName}
          </h1>
          <p className="profile-username">@{username}</p>
        </div>
        <div className="profile-tags">
          {tags?.map((tag, index) => (
            <span key={index} className="profile-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="profile-stats">
          <div className="profile-stats-card">
            <p className="profile-stats-number">{followersIds?.length}</p>
            <p className="profile-stats-label">Followers</p>
          </div>
          <div className="profile-stats-card">
            <p className="profile-stats-number">{followingsIds?.length}</p>
            <p className="profile-stats-label">Followings</p>
          </div>
          <div className="profile-stats-card">
            <p className="profile-stats-number">{numberOfTakenCourses}</p>
            <p className="profile-stats-label">Taken courses</p>
          </div>
          <div className="profile-stats-card">
            <p className="profile-stats-number">{numberOfPublishedCourses}</p>
            <p className="profile-stats-label">Published courses</p>
          </div>
        </div>
        {String(currentUser.id) !== String(userId) && (
          <div className="profile-actions">
            {followersIds?.includes(currentUser.id) ? (
              <button
                className="profile-unfollow-button"
                onClick={handleUnfollow}
              >
                Unfollow
              </button>
            ) : (
              <button className="profile-follow-button" onClick={handleFollow}>
                Follow
              </button>
            )}

            <button className="profile-message-button" onClick={handleMessage}>
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
