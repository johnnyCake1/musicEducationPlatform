import React, { useState } from "react";
import useLocalStorageState from "../util/useLocalStorageState";

const Login = () => {
  console.log("hello from Login page!");

  const [, setJwt] = useLocalStorageState("", "jwt");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const sendLoginRequest = () => {

    const reqBody = {
      email: username,
      password: password,
    };

    // TODO: refactor to use httpReqAsync
    fetch("api/v1/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(reqBody),
    })
      .then((res) => {
        if (res.status === 200) return Promise.all([res.json(), res.headers]);
        return Promise.reject("Invalid login attempt");
      })
      .then(([strBody, headers]) => {
        setJwt(headers.get("authorization"));
        window.location.href="dashboard"
      })
      .catch((message) => {
        alert(message);
      });
  };

  return (
    <>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="email"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button id="submit" type="button" onClick={sendLoginRequest}>
          Login
        </button>
      </div>
    </>
  );
};

export default Login;
