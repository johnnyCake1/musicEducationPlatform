import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import "./App.css";
import useLocalStorageState from "./util/useLocalStorageState";
import Homepage from "./components/Homepage";

function App() {
  console.log("Hello from App!");

  const [jwt, setJwt] = useLocalStorageState("", "jwt");

  useEffect(() => {
    console.log("Hello from useEffect!");

    //if jwt already exists in the localStorage, then we do not need to re-fecth it
    if (jwt) return;

    const reqBody = {
      email: "my_dummy_mail_1",
      password: "my_dummy_password_1",
    };

    fetch("api/v1/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(reqBody),
    })
      .then((res) => Promise.all([res.json(), res.headers]))
      .then(([strBody, headers]) => {
        setJwt(headers.get("authorization"));
      });
  });

  return (
    <Routes>
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/" element={<Homepage />} />
    </Routes>
    // <div className="App">
    //   <div>JWT value is: {jwt}</div>
    // </div>
  );
}

export default App;
