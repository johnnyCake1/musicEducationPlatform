import React, { useState } from "react";
import useLocalStorageState from "../../util/useLocalStorageState";
import "./Authorisation.css";

const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setJwt] = useLocalStorageState("", "jwt");
  const sendLoginRequest = (e) => {
    e.preventDefault();

    const reqBody = {
      username: username,
      password: password,
    };

    fetch("api/v1/auth/login", {
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
          return Promise.reject("Invalid login attempt");
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  return (
    <div className="auth_page">
      <div className="login">
        <h4 className="auth_title">Sign In</h4>
        <form onSubmit={sendLoginRequest}>
          <div className="text_area">
            <input
              type="username"
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
          <input type="submit" value="SIGN IN" className="btn" />
        </form>
        <a className="link" href="/register">
          Register a new account
        </a>
        <br />
        <a className="link" href="/restore_password">
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
