import React, { useEffect, useState } from "react";
import "./ProfilePicture.css";
import useLocalStorageState from "../../../../util/useLocalStorageState";
const ProfilePicture = ({
  size = 50,
  borderColor,
  onClick,
  backgroundColor = "#d9d9d9",
  imageSrc,
}) => {
  const [jwt] = useLocalStorageState("", "jwt");
  const [showModal, setShowModal] = useState(false);
  const [picSrc, setPicSrc] = useState(
    "https://courseplus.netlify.app/assets/images/avatars/placeholder.png"
  );
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (imageSrc) {
      setPicSrc(imageSrc);
    } else {
      console.log("using a placeholder for a profile picture");
    }
  }, [jwt, imageSrc]);

  onClick = onClick ?? openModal;

  const style = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: "50%",
    overflow: "hidden",
    border: borderColor ? `2px solid ${borderColor}` : "none",
    backgroundColor: backgroundColor,
  };

  return (
    <div style={{ ...style }}>
      <img
        src={picSrc}
        alt="Profile"
        onClick={onClick}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {showModal && (
        <div className="profile-picture-modal">
          <div className="profile-picture-modal-content">
            <img className="profile-picture-full" src={picSrc} alt="Profile" />
            <button
              className="profile-picture-modal-close"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfilePicture;
