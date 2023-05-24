import React, { useEffect, useState } from "react";
import "./ProfilePicture.css";
import useLocalStorageState from "../../../../util/useLocalStorageState";
import { getFile } from "../../../../services/httpReqAsync";
const ProfilePicture = ({
  size = 50,
  borderColor,
  onClick,
  backgroundColor = "#d9d9d9",
  userId,
  imageSrc,
}) => {
  const [jwt] = useLocalStorageState("", "jwt");
  const [showModal, setShowModal] = useState(false);
  const [picSrc, setPicSrc] = useState("https://via.placeholder.com/500x500");
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (imageSrc) {
      setPicSrc(imageSrc);
    } else if (userId) {
      getFile(`/api/v1/users/${userId}/profile-picture`, jwt)
        .then((blobFile) => {
          if (blobFile instanceof Blob) {
            setPicSrc(URL.createObjectURL(blobFile));
          }
        })
        .catch((err) => {
          console.warn("couldn't get profile picture: ", err);
        });
    } else {
      console.log("using a placeholder for a profile picture");
    }
  }, [jwt, userId, imageSrc]);

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
