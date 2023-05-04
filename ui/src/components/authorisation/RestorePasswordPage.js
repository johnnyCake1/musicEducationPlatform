import React, { useState } from "react";
import "./Authorisation.css";

const RestorePasswordPage = (props) => {
  const [username, setUsername] = useState("");

  const sendRegisterRequest = (e) => {
    e.preventDefault();
    //TODO: send username, link and stuff and redirect to /newPassword?username=$username
  };

  return (
    <div className="auth_page">
      <div className="login">
        <h4 className="auth_title">Restore password</h4>
        <form onSubmit={sendRegisterRequest}>
          <div className="text_area">
            <input
              type="username"
              id="username"
              name="username"
              placeholder="write your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="text_input"
            />
          </div>
          <input type="submit" value="Send confirmation" className="btn" />
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

export default RestorePasswordPage;
