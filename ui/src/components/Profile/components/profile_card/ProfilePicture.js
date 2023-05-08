import React, { useState } from 'react';
import './ProfilePicture.css';
function ProfilePicture({ src, size = 50, borderColor, onClick}) {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };

  //defaults
  src = src ?? "https://via.placeholder.com/500x500";
  onClick = onClick ?? openModal

  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    border: borderColor ? `2px solid ${borderColor}` : 'none',
  };

  return (
    <div style={{ ...style }}>
      <img src={src} alt="Profile" onClick={onClick} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {showModal && (
        <div className="profile-picture-modal">
          <div className="profile-picture-modal-content">
            <img className="profile-picture-full" src={src} alt="Profile" />
            <button className="profile-picture-modal-close" onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProfilePicture;
