import ProfilePicture from "./ProfilePicture";
import './ProfileCard.css'
const ProfileCard = () => {
  return (
    <div className="profile-header">
      <ProfilePicture
        src="https://via.placeholder.com/500x500"
        size={200}
        borderColor="#fff"
      />
      <div className="profile-info">
        <div className="profile-name-wrapper">
          <h1 className="profile-name">John Doe</h1>
          <p className="profile-username">@johndoe</p>
        </div>
        <div className="profile-role">Drum teacher</div>
        <div className="profile-stats">
          <div className="profile-stats-card">
            <p className="profile-stats-number">1000</p>
            <p className="profile-stats-label">Followers</p>
          </div>
          <div className="profile-stats-card">
            <p className="profile-stats-number">500</p>
            <p className="profile-stats-label">Following</p>
          </div>
          <div className="profile-stats-card">
            <p className="profile-stats-number">10</p>
            <p className="profile-stats-label">Courses</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-follow-button">Follow</button>
          <button className="profile-message-button">Message</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;