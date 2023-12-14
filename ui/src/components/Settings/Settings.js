import React, { useEffect, useState } from 'react';
import './Settings.css';
import { FaCamera, FaLock, FaUser } from 'react-icons/fa';
import ProfilePicture from '../Profile/components/profile_card/ProfilePicture';
import useLocalStorageState from '../../util/useLocalStorageState';
import { httpReqAsync } from '../../services/httpReqAsync';

const Settings = () => {
  const [currentUser, setCurrentUser] = useLocalStorageState(null, 'currentUser');
  const [userInfo, setUserInfo] = useState(null);
  const [jwt] = useLocalStorageState('', 'jwt');
  const [successMessage, setSuccessMessage] = useState('');
  const [failMessage, setFailMessage] = useState('');

  useEffect(() => {
    httpReqAsync(`/api/v1/users/${currentUser.id}`, 'GET', jwt).then(
      (result) => {
        setUserInfo(result);
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
    httpReqAsync('/api/v1/files', 'POST', jwt, file).then((result) => {
      console.log("result", result)
      if (result.file_url) {
        setUserInfo((prevValue) => ({
          ...prevValue,
          img_url: result.file_url,
          img_id: result.id,
        }));
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("sending userInfo:", userInfo);
    httpReqAsync(`/api/v1/users/${currentUser.id}`, 'PUT', jwt, userInfo)
      .then((result) => {
        setSuccessMessage('Changes succesfully saved');
        setCurrentUser({
          ...currentUser,
          firstName: result.firstName,
          lastName: result.lastName,
          aboutMe: result.aboutMe,
          img_url: result.img_url
        });
      })
      .catch(() => {
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
            <ProfilePicture imageSrc={userInfo?.img_url} size={100} />
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
            value={userInfo?.firstName ?? ''}
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
            value={userInfo?.lastName ?? ''}
            onChange={handleLastNameChange}
          />
        </div>

        <div>
          <label htmlFor="aboutMe">About me:</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            value={userInfo?.aboutMe ?? ''}
            className="mb-3"
            onChange={handleAboutMeChange}
            rows="4"
            cols="50"
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
      <div className={successMessage ? 'success' : failMessage ? 'fail' : ''}>
        {successMessage || failMessage}
      </div>
    </div>
  );
};

export default Settings;
