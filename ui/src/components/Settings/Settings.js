import React, { useEffect, useState } from "react";
import "./Settings.css";
import { FaCamera, FaLock, FaUser } from "react-icons/fa";
import ProfilePicture from "../Profile/components/profile_card/ProfilePicture";
import useLocalStorageState from "../../util/useLocalStorageState";
import { httpReqAsync } from "../../services/httpReqAsync";
import { API_URL } from "../../constants";

const Settings = () => {
  const [currentUser, setCurrentUser] = useLocalStorageState(
    null,
    "currentUser"
  );
  const [userInfo, setUserInfo] = useState(null);
  const [jwt] = useLocalStorageState("", "jwt");
  const [profilePictureSrc, setProfilePictureSrc] = useState("");
  const [newProfilePicFile, setNewProfilePicFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");

  useEffect(() => {
    httpReqAsync(`/api/v1/users/${currentUser.id}`, "GET", jwt).then(
      (result) => {
        setUserInfo(result);
        setProfilePictureSrc(result.img_url);
      }
    );
  }, [jwt, currentUser]);

  const handleFirstNameChange = (e) => {
    setUserInfo((prevValue) => ({ ...prevValue, firstName: e.target.value }));
  };

  const handleLastNameChange = (e) => {
    setUserInfo((prevValue) => ({ ...prevValue, lastName: e.target.value }));
  };

  const handleAboutMeChange = (e) => {
    setUserInfo((prevValue) => ({ ...prevValue, aboutMe: e.target.value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePictureSrc(reader.result);
    };

    if (file) {
      setNewProfilePicFile(file);
      reader.readAsDataURL(file);
    }
  };

  // const handleUsernameChange = (e) => {
  //   setUsername(e.target.value);
  // };

  // const handlePasswordChange = (e) => {
  //   setPassword(e.target.value);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProfilePicFile) {
      const formData = new FormData();
      formData.append("file", newProfilePicFile);

      fetch(API_URL + `/api/v1/users/${currentUser.id}/profile-picture`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      })
        .then((res) => {
          if (res.status === 200) {
            return res.text();
          }
          setFailMessage("Changes couldn't be saved");
          return Promise.reject("Couldn't update profile picture");
        })
        .then((img_url) => {
          setCurrentUser({ ...currentUser, img_url: img_url });
          setSuccessMessage("Changes succesfully saved");
        });
    }

    httpReqAsync(`/api/v1/users/${currentUser.id}`, "PUT", jwt, userInfo)
      .then((result) => {
        console.log("result", result);
        setSuccessMessage("Changes succesfully saved");
      })
      .catch(() => {
        console.log("result!");
        setFailMessage("Changes couldn't be saved");
      });
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="profilePicture">
            <FaCamera className="icon" /> Profile Picture:
          </label>
          <div className="profile-picture-container">
            <ProfilePicture imageSrc={profilePictureSrc} size={100} />
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="firstName">
            <FaUser className="icon" /> First Name:
          </label>
          <input
            type="text"
            id="firstName"
            value={userInfo?.firstName ?? ""}
            onChange={handleFirstNameChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            <FaUser className="icon" /> Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            value={userInfo?.lastName ?? ""}
            onChange={handleLastNameChange}
          />
        </div>

        <div>
          <label htmlFor="aboutMe">About me:</label>
          <input
            type="text"
            id="aboutMe"
            name="aboutMe"
            value={userInfo?.aboutMe ?? ""}
            onChange={handleAboutMeChange}
            className="settings-about-me"
          />
        </div>

        {/* <div className="form-group">
          <label htmlFor="username">
            <FaUser className="icon" /> Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <FaLock className="icon" /> New Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div> */}

        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
      <div className={successMessage ? "success" : failMessage ? "fail" : ""}>
        {successMessage || failMessage}
      </div>
    </div>
  );
};

export default Settings;
