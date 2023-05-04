import React, { useState } from "react";
import useLocalStorageState from "../../util/useLocalStorageState";
import "./Authorisation.css";

const RegisterPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setJwt] = useLocalStorageState("", "jwt");

  const [failMessage, setFailMessage] = useState("");

  const sendRegisterRequest = (e) => {
    e.preventDefault();

    //validate:
    if (password !== confirmPassword) {
      setFailMessage("password confirmation mismatch");
      return;
    }

    const reqBody = {
      username: username,
      password: password,
    };

    fetch("api/v1/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(reqBody),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setJwt(res.headers.get("authorization"));
          window.location.href = "dashboard";
        } else {
          return Promise.reject("Invalid register attempt: ");
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  return (
    <div className="auth_page">
      <div className="login">
        <h4 className="auth_title">Register</h4>
        <form onSubmit={sendRegisterRequest}>
          <div className="text_area">
            <input
              type="usrname"
              id="username"
              name="username"
              placeholder="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="text_input"
            />
          </div>
          <div className="text_area">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="text_input"
            />
          </div>
          <div className="text_area">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="repeat the password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="text_input"
            />
          </div>
          {failMessage ? <div className="error_message">{failMessage}</div> : <></>}
          <input type="submit" value="REGISTER" className="btn" />
        </form>
        <a className="link" href="/login">
          Log in with an existing account
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;
