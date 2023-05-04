import React, { useState } from "react";
import "./Authorisation.css";

const NewPasswordPage = (props) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [failMessage, setFailMessage] = useState("");

  const sendRegisterRequest = (e) => {
    e.preventDefault();
    //TODO: validate the new password and then change the user's password and log-in
  };

  return (
    <div className="auth_page">
      <div className="login">
        <h4 className="auth_title"> Register</h4>
        <form onSubmit={sendRegisterRequest}>
          <div className="text_area">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="make up a new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              className="text_input"
            />
          </div>
          <div className="text_area">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="repeat the new password"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
              }}
              className="text_input"
            />
          </div>
          {failMessage ? <div className="error_message">{failMessage}</div> : <></>}
          <input type="submit" value="Change the password" className="btn" />
        </form>
        <a className="link" href="/register">
          Register a new account
        </a>
        <br />
        <a className="link" href="/login">
          Log in with an existing account
        </a>
      </div>
    </div>
  );
};

export default NewPasswordPage;
